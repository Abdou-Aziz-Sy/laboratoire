package com.example.taskmanager.controller;

import com.example.taskmanager.dto.UserRegistrationDTO;
import com.example.taskmanager.model.User;
import com.example.taskmanager.service.EmailService;
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
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    // 📌 ENDPOINT: Inscription d'un utilisateur
    @PostMapping
    @Operation(summary = "Inscription d'un nouvel utilisateur", description = "Crée un nouveau compte utilisateur avec les informations fournies")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Utilisateur inscrit avec succès"),
        @ApiResponse(responseCode = "400", description = "Données d'entrée invalides"),
        @ApiResponse(responseCode = "409", description = "L'email existe déjà")
    })
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO userDTO) {
        try {
            // 🔍 Vérifie si l'email est déjà utilisé
            if (userService.existsByEmail(userDTO.getEmail())) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Cet email est déjà utilisé");
            }

            // 🧱 Création d'un utilisateur avec les infos reçues
            User user = new User();
            user.setEmail(userDTO.getEmail());
            user.setPassword(userDTO.getPassword());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setActivationToken(UUID.randomUUID().toString()); // Génère un token unique

            // 💾 Enregistrement en base de données (le mot de passe sera crypté dans le service)
            User savedUser = userService.registerUser(user);

            // ✉️ Envoi du mail d'activation
            emailService.sendActivationEmail(user.getEmail(), user.getActivationToken());

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Utilisateur inscrit avec succès. Un mail d'activation a été envoyé.");
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'inscription : " + e.getMessage());
        }
    }

    // 📌 ENDPOINT: Activation du compte
    @GetMapping("/activate")
    @Operation(summary = "Activation du compte", description = "Active un compte utilisateur via un token envoyé par mail")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Compte activé avec succès"),
        @ApiResponse(responseCode = "400", description = "Token invalide ou compte déjà activé")
    })
    public ResponseEntity<?> activateUser(@RequestParam("token") String token) {
        try {
            boolean activated = userService.activateUser(token);

            if (activated) {
                return ResponseEntity.ok("Compte activé avec succès. Vous pouvez maintenant vous connecter.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token invalide ou compte déjà activé.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'activation : " + e.getMessage());
        }
    }
}
