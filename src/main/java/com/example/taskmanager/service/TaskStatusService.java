package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskStatusHistoryDTO;
import com.example.taskmanager.dto.UpdateTaskStatusDTO;
import com.example.taskmanager.exception.AccessDeniedException;
import com.example.taskmanager.exception.InvalidStatusTransitionException;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.TaskStatusHistory;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.TaskStatusHistoryRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskStatusService {

    private final TaskRepository taskRepository;
    private final TaskStatusHistoryRepository taskStatusHistoryRepository;
    private final TaskService taskService;
    private final UserRepository userRepository;

    @Autowired
    public TaskStatusService(TaskRepository taskRepository,
                             TaskStatusHistoryRepository taskStatusHistoryRepository,
                             TaskService taskService,
                             UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.taskStatusHistoryRepository = taskStatusHistoryRepository;
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    /**
     * Met à jour le statut d'une tâche avec validation des transitions
     */
    @Transactional
    public Task updateTaskStatus(Long taskId, UpdateTaskStatusDTO statusDTO) {
        // Récupérer la tâche
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée: " + taskId));

        // Vérifier les droits d'accès
        User currentUser = getCurrentAuthenticatedUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous n'avez pas la permission de modifier cette tâche");
        }

        TaskStatus currentStatus = task.getStatus();
        TaskStatus newStatus = statusDTO.getNewStatus();

        // Vérifier si la transition est valide
        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus, newStatus);
        }

        // Sauvegarder l'ancien statut pour l'historique
        TaskStatus oldStatus = currentStatus;

        // Mettre à jour le statut de la tâche
        task.setStatus(newStatus);

        // Mettre à jour le champ completed en fonction du nouveau statut
        task.setCompleted(newStatus.isCompleted());

        // Si la tâche passe à DONE, mettre à jour completedAt
        if (newStatus == TaskStatus.DONE && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (newStatus != TaskStatus.DONE && task.getCompletedAt() != null) {
            task.setCompletedAt(null);
        }

        // Sauvegarder la tâche
        Task savedTask = taskRepository.save(task);

        // Créer l'entrée dans l'historique
        createStatusHistoryEntry(savedTask, oldStatus, newStatus, statusDTO.getComment());

        return savedTask;
    }

    /**
     * Récupère l'historique des changements de statut pour une tâche
     */
    @Transactional(readOnly = true) // Ajout d'une transaction en lecture seule
    public List<TaskStatusHistoryDTO> getTaskStatusHistory(Long taskId) {
        // Vérifier que la tâche existe
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée: " + taskId));

        // Vérifier les droits d'accès
        User currentUser = getCurrentAuthenticatedUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous n'avez pas la permission d'accéder à l'historique de cette tâche");
        }

        // Récupérer l'historique directement avec la requête
        List<TaskStatusHistory> historyList = taskStatusHistoryRepository.findByTaskIdOrderByChangedAtDesc(taskId);

        // Convertir les entités en DTOs sans référence à l'entité Task pour éviter les problèmes de sérialisation
        return historyList.stream()
            .map(history -> new TaskStatusHistoryDTO(
                history.getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getChangedAt(),
                history.getChangedBy(),
                history.getComment()
            ))
            .collect(Collectors.toList());
    }

    /**
     * Récupère les transitions possibles depuis le statut actuel d'une tâche
     */
    public List<TaskStatus> getAvailableTransitions(Long taskId) {
        Task task = taskService.getTaskById(taskId);
        return task.getStatus().getAllowedTransitions().stream().toList();
    }

    /**
     * Crée une entrée dans l'historique des changements de statut
     */
    private void createStatusHistoryEntry(Task task, TaskStatus oldStatus, TaskStatus newStatus, String comment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String changedBy = authentication.getName();

        TaskStatusHistory historyEntry = TaskStatusHistory.builder()
                .task(task)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .comment(comment)
                .changedAt(LocalDateTime.now())
                .build();

        taskStatusHistoryRepository.save(historyEntry);
    }

    /**
     * Récupère l'utilisateur authentifié actuellement
     */
    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Utilisateur non trouvé: " + email));
    }
}

