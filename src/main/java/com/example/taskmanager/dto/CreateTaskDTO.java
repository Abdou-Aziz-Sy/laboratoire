package com.example.taskmanager.dto;

import com.example.taskmanager.model.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskDTO {
    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    @NotNull(message = "La priorité est obligatoire")
    private TaskPriority priority;

    private LocalDateTime dueDate;
}