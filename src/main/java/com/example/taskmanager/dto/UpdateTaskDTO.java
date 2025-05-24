package com.example.taskmanager.dto;

import com.example.taskmanager.model.TaskPriority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UpdateTaskDTO {
    @Size(min = 3, max = 100, message = "Le titre doit contenir entre 3 et 100 caractères")
    private String title;

    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;

    private boolean completed;

    private TaskPriority priority;

    @Future(message = "La date d'échéance doit être dans le futur")
    private LocalDateTime dueDate;
}