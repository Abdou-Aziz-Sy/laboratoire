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
	        .csrf(csrf -> csrf.disable()) // désactiver CSRF pour Postman ou les tests
	        .authorizeHttpRequests(auth -> auth
	            // Autoriser Swagger
	            .requestMatchers(
	                "/swagger-ui.html",
	                "/swagger-ui/**",
	                "/v3/api-docs/**",
	                "/swagger-resources/**",
	                "/webjars/**"
	            ).permitAll()

	            // Autoriser l'inscription
	            .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()

	            // Autoriser l'activation par token
	            .requestMatchers(HttpMethod.GET, "/api/users/activate").permitAll()

	            // Toute autre requête doit être authentifiée
	            .anyRequest().authenticated()
	        )
	        .httpBasic(); // ou formLogin() selon ton besoin

	    return http.build();
	}


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}