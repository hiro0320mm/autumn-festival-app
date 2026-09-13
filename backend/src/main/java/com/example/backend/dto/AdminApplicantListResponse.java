package com.example.backend.dto;

import com.example.backend.entity.CancelStatus;

public record AdminApplicantListResponse (
        Long applicantId,
        String receptionNumber,
        String groupName,
        String applicantName,
        String kana,
        Integer age,
        String positionName,
        String address,
        String tel,
        String schoolName,
        String schoolGrade,
        String note,
        String staffMemo,
        CancelStatus cancelStatus
){}
