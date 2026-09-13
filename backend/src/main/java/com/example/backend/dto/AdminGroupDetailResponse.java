package com.example.backend.dto;

import java.time.LocalDateTime;

public record AdminGroupDetailResponse(
        Long groupId,
        String groupName,
        String district,
        String officeAddress,
        String officeTel,
        String contactName,
        String contactTel,
        String description,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {}
