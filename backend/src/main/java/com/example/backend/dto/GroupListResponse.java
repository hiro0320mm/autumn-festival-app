package com.example.backend.dto;

import java.util.List;

public record GroupListResponse (
        Long groupId,
        String groupName,
        String officeTel,
        List<PositionListResponse> positions
) {}
