package com.example.backend.dto;

public record StaffLoginResponse (
        Long staffId,
        String staffName,
        Long groupId,
        String groupName
){}
