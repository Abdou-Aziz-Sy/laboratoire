package com.example.taskmanager.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskmanager.model.User;
import com.example.taskmanager.security.JwtUtil;
import com.example.taskmanager.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")

public class AuthenticationController {

        private final UserService userService;

        public AuthenticationController(UserService userService) {
                this.userService = userService;
        }

        @Autowired
        private AuthenticationManager authManager;

        @Autowired
        private JwtUtil jwtUtil;

        @PostMapping("/login")
        public Map<String, Object> login(@RequestBody @Valid LoginRequest loginRequest) {
                try {
                        System.out.println("Tentative de connexion pour : " + loginRequest.getEmail());

                        // Vérifiez si l'utilisateur est actif
                        User user = userService.findByEmail(loginRequest.getEmail())
                                        .orElseThrow(() -> new UsernameNotFoundException(
                                                        "Utilisateur non trouvé : " + loginRequest.getEmail()));

                        if (!user.isActive()) {
                                throw new IllegalStateException("Le compte utilisateur est désactivé");
                        }

                        Authentication authentication = authManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                                                        loginRequest.getPassword()));
                        System.out.println("Authentification réussie pour : " + loginRequest.getEmail());

                        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                        String token = jwtUtil.generateToken(userDetails.getUsername());

                        Map<String, Object> userInfo = Map.of(
                                        "id", user.getId(),
                                        "email", user.getEmail(),
                                        "firstName", user.getFirstName(),
                                        "lastName", user.getLastName());

                        return Map.of("token", token, "user", userInfo);
                } catch (IllegalStateException e) {
                        System.err.println("Erreur lors de la connexion : " + e.getMessage());
                        throw new RuntimeException("Le compte utilisateur est désactivé");
                } catch (Exception e) {
                        System.err.println("Erreur lors de la connexion : " + e.getMessage());
                        throw new RuntimeException("Les identifications sont erronées");
                }
        }

}
