package com.example.backend.service;

import com.example.backend.dto.MyPageLoginRequest;
import com.example.backend.entity.Applicants;
import com.example.backend.entity.CancelStatus;
import com.example.backend.exception.MyPageLoginException;
import com.example.backend.repository.ApplyRepository;
import com.example.backend.util.InputNormalizer;
import org.springframework.stereotype.Service;

@Service
public class MyPageLoginService {

    private final ApplyRepository applyRepository;

    public MyPageLoginService(ApplyRepository applyRepository) {
        this.applyRepository = applyRepository;
    }

    public Applicants login(MyPageLoginRequest request) {
        Applicants applicants = applyRepository
                .findByReceptionNumber(request.receptionNumber())
                .orElseThrow(() -> new MyPageLoginException("お名前・電話番号・申込受付番号のいずれかが正しくありません"));

        String requestName = InputNormalizer.removeSpaces(request.applicantName());
        String requestTel = InputNormalizer.removeSpaces(request.tel());

        boolean nameMatches = applicants.getApplicantName().equals(requestName);
        boolean telMatches = applicants.getTel().equals(requestTel);

        if (!nameMatches || !telMatches) {
            throw new MyPageLoginException("お名前・電話番号・申込受付番号のいずれかが正しくありません");
        }

        if (applicants.getCancelStatus() == CancelStatus.CANCELED) {
            throw new IllegalArgumentException("この申込はキャンセル済みです");
        }

        return applicants;
    }

}
