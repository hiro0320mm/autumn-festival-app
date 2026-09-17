package com.example.backend.dto;

import java.time.LocalDateTime;

public record AdminAnnounceListResponse(
        Long announcementId,
        Long groupId,
        String title,
        String content,
        Boolean isPublished,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {
}
