package com.example.taskmanager.model;

import java.util.Set;

public enum TaskStatus {
    TODO("À faire"),
    IN_PROGRESS("En cours"),
    REVIEW("En révision"),
    DONE("Terminé"),
    CANCELLED("Annulé");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Définit les transitions valides depuis ce statut
     */
    public Set<TaskStatus> getAllowedTransitions() {
        return switch (this) {
            case TODO -> Set.of(IN_PROGRESS, CANCELLED);
            case IN_PROGRESS -> Set.of(TODO, REVIEW, DONE, CANCELLED);
            case REVIEW -> Set.of(IN_PROGRESS, DONE, CANCELLED);
            case DONE -> Set.of(IN_PROGRESS); // Possibilité de rouvrir une tâche terminée
            case CANCELLED -> Set.of(TODO); // Possibilité de réactiver une tâche annulée
        };
    }

    /**
     * Vérifie si une transition est valide
     */
    public boolean canTransitionTo(TaskStatus newStatus) {
        return getAllowedTransitions().contains(newStatus);
    }

    /**
     * Indique si ce statut correspond à une tâche terminée
     */
    public boolean isCompleted() {
        return this == DONE;
    }
}