package com.example.taskmanager.service;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Vérifie si un utilisateur existe avec un email donné
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // ✅ Inscription d'un nouvel utilisateur
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ✅ Activation du compte via un token
    public boolean activateUser(String token) {
        // 🔍 Recherche d'un utilisateur avec ce token
        Optional<User> optionalUser = userRepository.findByActivationToken(token);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Si le compte est déjà activé
            if (user.isActive()) {
                return false;
            }

            // 🟢 Activation du compte
            user.setActive(true);
            user.setActivationToken(null); // On supprime le token (sécurité)

            userRepository.save(user); // On enregistre les changements
            return true;
        }

        // ❌ Aucun utilisateur avec ce token
        return false;
    }
}
