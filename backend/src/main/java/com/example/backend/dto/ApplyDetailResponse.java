package com.example.backend.dto;

public record ApplyDetailResponse(
        Long applicantId,
        String applicantName,
        String kana,
        Integer age,
        String address,
        String tel,
        String email,
        String parentName,
        String groupName,
        String positionName,
        Boolean isStudent,
        String schoolName,
        String schoolGrade,
        String schoolClass,
        String note
){}
