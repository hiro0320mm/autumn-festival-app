package com.example.backend.dto;

public record AdminGroupDetailResponse(
        Long groupId,
        String groupName,
        String district,
        String officeAddress,
        String officeTel,
        String contactName,
        String contactTel,
        String description
) {}
