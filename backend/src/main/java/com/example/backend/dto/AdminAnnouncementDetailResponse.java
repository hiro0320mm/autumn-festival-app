package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record AdminAnnouncementDetailResponse(

        Long groupId,
        String groupName,
        String title,
        String content,
        Boolean isPublished,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt

) {
}
