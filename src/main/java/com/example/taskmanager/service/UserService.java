package com.example.taskmanager.service;

import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtTokenProvider;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
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

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
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

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));
        System.out.println("Utilisateur trouvé : " + user.getEmail());

        // Vérifie le mot de passe
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Mot de passe incorrect pour : " + email);
            throw new BadCredentialsException("Mot de passe incorrect");
        }

        return user;
    }

    public String generateJwtToken(User user) {
        return jwtTokenProvider.generateToken(user.getEmail());
    }

    public void sendPasswordResetEmail(String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'sendPasswordResetEmail'");
    }
}
