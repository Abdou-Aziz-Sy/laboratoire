package com.example.taskmanager.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	
	 @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http
	            .csrf(csrf -> csrf.disable()) // désactiver CSRF pour Postman
	            .authorizeHttpRequests(auth -> auth
	                    // Autoriser Swagger
	                    .requestMatchers(
	                        "/swagger-ui.html",
	                        "/swagger-ui/**",
	                        "/v3/api-docs/**",
	                        "/swagger-resources/**",
	                        "/webjars/**"
	                    ).permitAll()
	                    // Autoriser l'inscription des utilisateurs
	                    .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
	                    // Toutes les autres requêtes nécessitent une auth
	                    .anyRequest().authenticated()
	            )
	            .httpBasic(); // ou formLogin si tu préfères

	        return http.build();
	    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}