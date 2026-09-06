package com.example.backend.service;

import com.example.backend.dto.ApplicantListResponse;
import com.example.backend.entity.Applicants;
import com.example.backend.repository.ApplicantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicantsService {

    private final ApplicantsRepository applicantsRepository;

    public List<ApplicantListResponse> findAll() {
        return applicantsRepository.findAll().stream()
                .map(applicants -> new ApplicantListResponse(
                        applicants.getApplicantId(),
                        applicants.getReceptionNumber(),
                        applicants.getApplicantName(),
                        applicants.getKana(),
                        applicants.getAge(),
                        applicants.getAddress(),
                        applicants.getTel(),
                        applicants.getEmail(),
                        applicants.getParentName(),
                        applicants.getGroup().getGroupName(),
                        applicants.getPosition().getPositionName(),
                        applicants.getIsStudent(),
                        applicants.getSchoolName(),
                        applicants.getSchoolGrade(),
                        applicants.getSchoolClass(),
                        applicants.getNote(),
                        applicants.getStaffMemo()
                ))
                .toList();
    }
}
