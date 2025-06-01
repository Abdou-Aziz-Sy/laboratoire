package com.example.taskmanager.repository;

import com.example.taskmanager.model.TaskStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskStatusHistoryRepository extends JpaRepository<TaskStatusHistory, Long> {

    /**
     * Récupère l'historique des changements de statut pour une tâche donnée,
     * trié par date de changement (plus récent en premier)
     */
    @Query("SELECT h FROM TaskStatusHistory h WHERE h.task.id = :taskId ORDER BY h.changedAt DESC")
    List<TaskStatusHistory> findByTaskIdOrderByChangedAtDesc(@Param("taskId") Long taskId);

    /**
     * Récupère le dernier changement de statut pour une tâche
     */
    @Query("SELECT h FROM TaskStatusHistory h WHERE h.task.id = :taskId ORDER BY h.changedAt DESC")
    Optional<TaskStatusHistory> findLatestByTaskId(@Param("taskId") Long taskId);
}

