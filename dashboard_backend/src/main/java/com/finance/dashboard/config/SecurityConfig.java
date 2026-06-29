package com.finance.dashboard.config;

import com.finance.dashboard.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        //  Public endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml"
                        ).permitAll()

                        // Role based access
                        .requestMatchers("/api/dashboard/**").hasAnyRole("VIEWER", "ANALYST", "ADMIN")

                        // Reads: everyone with a role can view transactions (incl. /page, /{id})
                        .requestMatchers(HttpMethod.GET, "/api/transactions/**").hasAnyRole("VIEWER", "ANALYST", "ADMIN")

                        // Writes: only ANALYST/ADMIN can create or edit
                        .requestMatchers(HttpMethod.POST, "/api/transactions/**").hasAnyRole("ANALYST", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/transactions/**").hasAnyRole("ANALYST", "ADMIN")

                        // Deletes/restores: ADMIN only, matching your frontend's delete button logic
                        .requestMatchers(HttpMethod.DELETE, "/api/transactions/**").hasRole("ADMIN")

                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                //  Register JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}