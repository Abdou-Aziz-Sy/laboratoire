package com.example.taskmanager.exception;

import com.example.taskmanager.model.TaskStatus;

public class InvalidStatusTransitionException extends RuntimeException {

  public InvalidStatusTransitionException(TaskStatus currentStatus, TaskStatus requestedStatus) {
    super(String.format("Transition invalide: impossible de passer du statut '%s' au statut '%s'",
            currentStatus.getDisplayName(), requestedStatus.getDisplayName()));
  }

  public InvalidStatusTransitionException(String message) {
    super(message);
  }
}