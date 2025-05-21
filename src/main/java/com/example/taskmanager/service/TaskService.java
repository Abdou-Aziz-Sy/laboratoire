package com.example.taskmanager.service;

import com.example.taskmanager.dto.CreateTaskDTO;
import com.example.taskmanager.exception.AccessDeniedException;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskPriority;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Task createTask(Long userId, CreateTaskDTO taskDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .priority(taskDTO.getPriority())
                .dueDate(taskDTO.getDueDate())
                .build();

        user.addTask(task);
        return taskRepository.save(task);
    }

    public List<Task> getUserTasks(Long userId) {
        return taskRepository.findByUserId(userId);
    }

      public Page<Task> getAllTasks(int page, int size, String title, TaskPriority priority, Boolean completed) {
        // Créer les spécifications basées sur les filtres
        Specification<Task> spec = Specification.where(null);
        
        if (title != null && !title.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> 
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }
        
        if (priority != null) {
            spec = spec.and((root, query, criteriaBuilder) -> 
                criteriaBuilder.equal(root.get("priority"), priority));
        }
        
        if (completed != null) {
            spec = spec.and((root, query, criteriaBuilder) -> 
                criteriaBuilder.equal(root.get("completed"), completed));
        }
        
        // Sécurité: ne récupérer que les tâches de l'utilisateur actuellement authentifié
        User currentUser = getCurrentAuthenticatedUser();
        spec = spec.and((root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("user").get("id"), currentUser.getId()));
        
        return taskRepository.findAll(spec, PageRequest.of(page, size, Sort.by("dueDate").ascending()));
    }

      public Task getTaskById(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée: " + id));
        
        // Vérifier les droits d'accès
        User currentUser = getCurrentAuthenticatedUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException ("Vous n'avez pas la permission d'accéder à cette tâche");
        }
        
        return task;
    }

      private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }


}