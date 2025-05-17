package com.example.taskmanager.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

class TaskTest {

    private Task task;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Créer un utilisateur pour les tests
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword("password");
        
        // Initialiser une tâche pour les tests
        task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setUser(user);
    }

    @Test
    void testTaskCreation() {
        assertNotNull(task);
        assertEquals("Test Task", task.getTitle());
        assertEquals("Test Description", task.getDescription());
        assertEquals(TaskPriority.MOYENNE, task.getPriority()); // Valeur par défaut
        assertFalse(task.isCompleted()); // Valeur par défaut
        assertNotNull(task.getUser());
        assertEquals(1L, task.getUser().getId());
    }

    @Test
    void testPrePersist() {
        // Tester la méthode onCreate (PrePersist)
        assertNull(task.getCreatedAt());
        assertNull(task.getUpdatedAt());
        
        task.onCreate();
        
        assertNotNull(task.getCreatedAt());
        assertNotNull(task.getUpdatedAt());
        assertTrue(ChronoUnit.SECONDS.between(task.getCreatedAt(), LocalDateTime.now()) < 5);
    }

    @Test
    void testPreUpdate() {
        // Initialiser createdAt et updatedAt
        LocalDateTime initialTime = LocalDateTime.now().minusMinutes(10);
        task.setCreatedAt(initialTime);
        task.setUpdatedAt(initialTime);
        
        // Tester la méthode onUpdate sans compléter la tâche
        task.onUpdate();
        
        assertEquals(initialTime, task.getCreatedAt()); // createdAt ne change pas
        assertNotEquals(initialTime, task.getUpdatedAt()); // updatedAt change
        assertNull(task.getCompletedAt()); // completedAt reste null
        
        // Tester la méthode onUpdate avec une tâche complétée
        task.setCompleted(true);
        task.onUpdate();
        
        assertNotNull(task.getCompletedAt());
        assertTrue(ChronoUnit.SECONDS.between(task.getCompletedAt(), LocalDateTime.now()) < 5);
        
        // Tester la réinitialisation de completedAt lors du démarquage d'une tâche
        task.setCompleted(false);
        task.onUpdate();
        
        assertNull(task.getCompletedAt());
    }

    @Test
    void testIsOverdue() {
        // Une tâche sans date d'échéance n'est jamais en retard
        assertFalse(task.isOverdue());
        
        // Une tâche avec date d'échéance future n'est pas en retard
        task.setDueDate(LocalDateTime.now().plusDays(1));
        assertFalse(task.isOverdue());
        
        // Une tâche avec date d'échéance passée est en retard
        task.setDueDate(LocalDateTime.now().minusDays(1));
        assertTrue(task.isOverdue());
        
        // Une tâche complétée n'est jamais en retard même si la date est passée
        task.setCompleted(true);
        assertFalse(task.isOverdue());
    }

    @Test
    void testBuilderPattern() {
        // Tester le pattern Builder généré par Lombok
        LocalDateTime now = LocalDateTime.now();
        User testUser = new User();
        testUser.setId(2L);
        
        Task builtTask = Task.builder()
                .title("Builder Task")
                .description("Created with builder")
                .priority(TaskPriority.URGENT)
                .dueDate(now)
                .user(testUser)
                .build();
        
        assertEquals("Builder Task", builtTask.getTitle());
        assertEquals("Created with builder", builtTask.getDescription());
        assertEquals(TaskPriority.URGENT, builtTask.getPriority());
        assertEquals(now, builtTask.getDueDate());
        assertEquals(2L, builtTask.getUser().getId());
        assertFalse(builtTask.isCompleted()); // Valeur par défaut
    }
    
    @Test
    void testDefaultValues() {
        Task newTask = new Task();
        assertEquals(TaskPriority.MOYENNE, newTask.getPriority());
        assertFalse(newTask.isCompleted());
    }
}