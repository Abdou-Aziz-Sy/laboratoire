package com.example.taskmanager.controller;

import com.example.taskmanager.dto.UserRegistrationDTO;
import com.example.taskmanager.model.User;
import com.example.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Inscription d'un nouvel utilisateur", description = "Crée un nouveau compte utilisateur avec les informations fournies")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Utilisateur inscrit avec succès"),
        @ApiResponse(responseCode = "400", description = "Données d'entrée invalides"),
        @ApiResponse(responseCode = "409", description = "L'email existe déjà")
    })
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO userDTO) {
        try {
            if (userService.existsByEmail(userDTO.getEmail())) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Cet email est déjà utilisé");
            }

            User user = new User();
            user.setEmail(userDTO.getEmail());
            user.setPassword(userDTO.getPassword());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setActivationToken(UUID.randomUUID().toString());

            User savedUser = userService.registerUser(user);
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Utilisateur inscrit avec succès. Jeton d'activation : " + savedUser.getActivationToken());
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'inscription : : " + e.getMessage());
        }
    }
}