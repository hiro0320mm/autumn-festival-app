package com.example.backend.dto;

import com.example.backend.entity.CancelStatus;

public record AdminApplicantDetailResponse (
        Long applicantId,
        String receptionNumber,
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
        CancelStatus cancelStatus
) {}
