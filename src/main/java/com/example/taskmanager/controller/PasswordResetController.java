package com.example.taskmanager.controller;

import com.example.taskmanager.dto.PasswordResetDTO;
import com.example.taskmanager.dto.PasswordResetRequestDTO;
import com.example.taskmanager.service.EmailService;
import com.example.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/password")
public class PasswordResetController {

    private final UserService userService;
    private final EmailService emailService;

    public PasswordResetController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/reset-request")
    @Operation(summary = "Demande de réinitialisation de mot de passe",
            description = "Envoie un email avec un lien pour réinitialiser le mot de passe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email envoyé avec succès"),
            @ApiResponse(responseCode = "404", description = "Email non trouvé")
    })
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDTO requestDTO) {
        String token = userService.createPasswordToken(requestDTO.getEmail());

        if (token != null) {
            emailService.sendPasswordResetEmail(requestDTO.getEmail(), token);
            return ResponseEntity.ok("Un email de réinitialisation a été envoyé à votre adresse");
        } else {
            return ResponseEntity.status(404).body("Aucun compte n'est associé à cet email");
        }
    }

    @PostMapping("/reset")
    @Operation(summary = "Réinitialisation du mot de passe",
            description = "Réinitialise le mot de passe avec le token fourni")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mot de passe réinitialisé avec succès"),
            @ApiResponse(responseCode = "400", description = "Token invalide ou expiré")
    })
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetDTO resetDTO) {
        boolean result = userService.resetPassword(resetDTO.getToken(), resetDTO.getPassword());

        if (result) {
            return ResponseEntity.ok("Mot de passe réinitialisé avec succès");
        } else {
            return ResponseEntity.badRequest().body("Token invalide ou expiré");
        }
    }
}