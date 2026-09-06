package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF保護を無効化
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/mypage/login").permitAll()
                        .requestMatchers("/api/mypage/**").authenticated()
                        .anyRequest().permitAll() // すべてのリクエストを認証なしで許可
                );
        return http.build();
    }
}
