package com.example.taskmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    private String firstName;
    private String lastName;
    private boolean active = false;
    private String activationToken;
	private String resetPasswordToken;
	@Column(name = "reset_token_expiry")
	private LocalDateTime resetPasswordTokenExpire;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Task> tasks = new ArrayList<>();


    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getActivationToken() {
		return activationToken;
	}

	public void setActivationToken(String activationToken) {
		this.activationToken = activationToken;
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

	@PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
	
	@PrePersist
	protected void onCreate() {
	    createdAt = LocalDateTime.now();
	}

	public String getResetPasswordToken() {
		return resetPasswordToken;
	}

	public void setResetPasswordToken(String resetPasswordToken) {
		this.resetPasswordToken = resetPasswordToken;
	}

	public LocalDateTime getResetPasswordTokenExpire() {
		return resetPasswordTokenExpire;
	}

	public void setResetPasswordTokenExpire(LocalDateTime resetPasswordTokenExpire) {
		this.resetPasswordTokenExpire = resetPasswordTokenExpire;
	}

	public List<Task> getTasks() {
    return tasks;
}

public void setTasks(List<Task> tasks) {
    this.tasks = tasks;
}

// Méthodes utilitaires pour gérer la relation bidirectionnelle
public void addTask(Task task) {
    if (!tasks.contains(task)) {
        tasks.add(task);
        // Éviter les appels récursifs infinis
        if (task.getUser() != this) {
            task.setUser(this);
        }
    }
}

public void removeTask(Task task) {
    if (tasks.contains(task)) {
        tasks.remove(task);
        // Éviter les appels récursifs infinis
        if (task.getUser() == this) {
            task.setUser(null);
        }
    }
}


}

