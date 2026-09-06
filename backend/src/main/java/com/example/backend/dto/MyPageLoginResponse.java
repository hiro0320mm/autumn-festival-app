package com.example.backend.dto;

import com.example.backend.entity.Applicants;

public record MyPageLoginResponse(
        Long applicantId,
        String applicantName,
        String receptionNumber
) {
    public static MyPageLoginResponse from(Applicants applicants) {
        return new MyPageLoginResponse(
                applicants.getApplicantId(),
                applicants.getApplicantName(),
                applicants.getReceptionNumber()
        );
    }
}

