package com.example.taskmanager.controller;

import com.example.taskmanager.dto.CreateTaskDTO;
import com.example.taskmanager.dto.UpdateTaskDTO;
import com.example.taskmanager.dto.UpdateTaskStatusDTO;
import com.example.taskmanager.dto.TaskStatusHistoryDTO;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskPriority;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.TaskStatusHistory;
import com.example.taskmanager.service.TaskService;

import com.example.taskmanager.service.TaskStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskStatusService taskStatusService;

    @Autowired
    public TaskController(TaskService taskService, TaskStatusService taskStatusService) {
        this.taskService = taskService;
        this.taskStatusService = taskStatusService;
    }
    @Operation(summary = "Create a new task", description = "Creates a new task for a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Task created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/users/{userId}")
    public ResponseEntity<Task> createTask(@PathVariable Long userId, @Valid @RequestBody CreateTaskDTO taskDTO) {
        Task createdTask = taskService.createTask(userId, taskDTO);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Task>> getUserTasks(@PathVariable Long userId) {
        List<Task> tasks = taskService.getUserTasks(userId);
        return ResponseEntity.ok(tasks);
    }

     @Operation(summary = "Get all tasks", description = "Retrieves all tasks with filtering and pagination")
     @GetMapping
    public ResponseEntity<Page<Task>> getAllTasks(
            @Parameter(description = "Page number (zero-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Filter by title (case-insensitive, partial match)") @RequestParam(required = false) String title,
            @Parameter(description = "Filter by priority")  @RequestParam(required = false) TaskPriority priority,
            @Parameter(description = "Filter by completion status")  @RequestParam(required = false) Boolean completed) {
        
        Page<Task> tasks = taskService.getAllTasks(page, size, title, priority, completed);
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Get task by ID", description = "Retrieves a specific task by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Task found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden - No permission to access this task"),
        @ApiResponse(responseCode = "404", description = "Task not found")
    })
     @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }


    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une tâche existante",
            description = "Met à jour une tâche en fonction de l'ID fourni. Seul le propriétaire de la tâche peut la modifier.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tâche mise à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Données de requête invalides"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - vous n'êtes pas le propriétaire de cette tâche"),
            @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
    })
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskDTO updateTaskDTO) {

        Task updatedTask = taskService.updateTask(id, updateTaskDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(summary = "Mettre à jour le statut d'une tâche",
            description = "Met à jour le statut d'une tâche avec validation des transitions autorisées")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statut mis à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Transition de statut invalide ou données invalides"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - vous n'êtes pas le propriétaire de cette tâche"),
            @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskStatusDTO statusDTO) {

        Task updatedTask = taskStatusService.updateTaskStatus(id, statusDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(summary = "Récupérer l'historique des changements de statut",
            description = "Récupère l'historique complet des changements de statut pour une tâche")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historique récupéré avec succès"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - vous n'êtes pas le propriétaire de cette tâche"),
            @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
    })
    @GetMapping("/{id}/status-history")
    public ResponseEntity<List<TaskStatusHistoryDTO>> getTaskStatusHistory(@PathVariable Long id) {
        List<TaskStatusHistoryDTO> history = taskStatusService.getTaskStatusHistory(id);
        return ResponseEntity.ok(history);
    }

    @Operation(summary = "Récupérer les transitions de statut disponibles",
            description = "Récupère la liste des statuts vers lesquels la tâche peut transitionner")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transitions disponibles récupérées avec succès"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - vous n'êtes pas le propriétaire de cette tâche"),
            @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
    })
    @GetMapping("/{id}/available-transitions")
    public ResponseEntity<List<TaskStatus>> getAvailableTransitions(@PathVariable Long id) {
        List<TaskStatus> availableTransitions = taskStatusService.getAvailableTransitions(id);
        return ResponseEntity.ok(availableTransitions);
    }
}
