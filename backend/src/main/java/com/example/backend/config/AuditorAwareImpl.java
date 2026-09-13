package com.example.backend.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        // 未ログイン（申込フォームなど）
        if (authentication == null
                || authentication instanceof AnonymousAuthenticationToken) {

            return Optional.of("申込ユーザー");
        }

        // 管理者ログイン
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                                || authority.getAuthority().equals("ROLE_SUPER_ADMIN")
                );

        if (isAdmin) {
            return Optional.of(authentication.getName());
        }

        // マイページの申込者ログイン
        return Optional.of("申込ユーザー");
    }
}