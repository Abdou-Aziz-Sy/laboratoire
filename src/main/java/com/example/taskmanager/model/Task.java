package com.example.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Builder.Default
    private boolean completed = false;

	@Enumerated(EnumType.STRING)
	@Builder.Default
	private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskPriority priority = TaskPriority.MOYENNE;
    
    private LocalDateTime dueDate;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"tasks", "hibernateLazyInitializer"})
    private User user;

	@OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@Builder.Default
	@JsonIgnoreProperties("task")
	private List<TaskStatusHistory> statusHistory = new ArrayList<>();


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public TaskPriority getPriority() {
		return priority;
	}

	public void setPriority(TaskPriority priority) {
		this.priority = priority;
	}

	public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		// Gérer correctement la relation bidirectionnelle
		if (this.user != null && this.user != user) {
			this.user.getTasks().remove(this);
		}
		this.user = user;
		if (user != null && !user.getTasks().contains(this)) {
			user.getTasks().add(this);
		}
	}

	public TaskStatus getStatus() {
		return status;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}

	public List<TaskStatusHistory> getStatusHistory() {
		return statusHistory;
	}

	public void setStatusHistory(List<TaskStatusHistory> statusHistory) {
		this.statusHistory = statusHistory;
	}


	@PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();

		// Synchroniser le champ completed avec le statut
		if (status != null) {
			this.completed = status.isCompleted();
		}

		if (completed && completedAt == null) {
			completedAt = LocalDateTime.now();
		} else if (!completed && completedAt != null) {
			completedAt = null;
		}
	}
    
    // Méthodes utilitaires
    public boolean isOverdue() {
        return dueDate != null && 
               !completed && 
               LocalDateTime.now().isAfter(dueDate);
    }
}

