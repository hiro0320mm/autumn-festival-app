package com.example.backend.dto;

import com.example.backend.util.InputNormalizer;

import java.util.List;

public record GroupListResponse (
        Long groupId,
        String groupName,
        List<PositionListResponse> positions
) {}
