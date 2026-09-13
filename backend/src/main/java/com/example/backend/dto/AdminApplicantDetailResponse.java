package com.example.backend.dto;

import com.example.backend.entity.CancelStatus;

import java.time.LocalDateTime;

public record AdminApplicantDetailResponse (
        Long groupId,
        Long applicantId,
        String receptionNumber,
        String groupName,
        String applicantName,
        String kana,
        Integer age,
        String positionName,
        String address,
        String tel,
        String email,
        String parentName,
        Boolean isStudent,
        String schoolName,
        String schoolGrade,
        String schoolClass,
        String note,
        String staffMemo,
        CancelStatus cancelStatus,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {}
