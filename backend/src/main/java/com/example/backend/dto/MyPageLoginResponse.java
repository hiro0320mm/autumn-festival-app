package com.example.backend.dto;

import com.example.backend.entity.Applicants;
import lombok.Getter;

@Getter
public class MyPageLoginResponse {
    private Long applicantId;
    private String applicantName;
    private String receptionNumber;

    public static MyPageLoginResponse from(Applicants applicants) {
        MyPageLoginResponse res = new MyPageLoginResponse();
        res.applicantId = applicants.getApplicantId();
        res.applicantName = applicants.getApplicantName();
        res.receptionNumber = applicants.getReceptionNumber();
        return res;
    }
}


