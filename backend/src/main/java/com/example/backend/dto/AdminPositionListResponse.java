package com.example.backend.dto;

import java.time.LocalDateTime;

public record AdminPositionListResponse(
        Long positionId,
        String positionName,
        String target,
        Integer maxCapacity,
        LocalDateTime deadline,
        Boolean recruitmentStatus
) {
}
