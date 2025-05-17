package com.example.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(String to, String activationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Activation de votre compte");
        message.setText("Cliquez sur le lien pour activer votre compte : " +
                "http://localhost:8081/api/users/activate?token=" + activationToken);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Réinitialisation de votre mot de passe");
        message.setText("Cliquez sur le lien pour réinitialiser votre mot de passe : " +
                "http://localhost:8081/reset-password?token=" + resetToken);

        mailSender.send(message);
    }

    }
