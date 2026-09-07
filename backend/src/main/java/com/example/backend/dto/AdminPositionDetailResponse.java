package com.example.backend.dto;

import java.time.LocalDateTime;

public record AdminPositionDetailResponse(
        Long positionId,
        String positionName,
        String target,
        Integer maxCapacity,
        LocalDateTime deadline,
        Boolean recruitmentStatus,
        String updatedBy,
        LocalDateTime updatedAt
) {
}
