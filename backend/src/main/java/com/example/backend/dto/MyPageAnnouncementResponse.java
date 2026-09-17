package com.example.backend.dto;

import java.time.LocalDateTime;

public record MyPageAnnouncementResponse(
        Long announcementId,
        String title,
        String content,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {
}