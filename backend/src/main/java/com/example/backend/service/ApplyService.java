package com.example.backend.service;

import com.example.backend.dto.ApplyDetailResponse;
import com.example.backend.dto.ApplyForm;
import com.example.backend.dto.MyPageUpdateRequest;
import com.example.backend.entity.Applicants;
import com.example.backend.entity.Groups;
import com.example.backend.entity.Positions;
import com.example.backend.repository.ApplicantsRepository;
import com.example.backend.repository.ApplyRepository;
import com.example.backend.repository.GroupsRepository;
import com.example.backend.repository.PositionsRepository;
import com.example.backend.util.InputNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApplyService {

    private final ApplicantsRepository applicantsRepository;
    private final GroupsRepository groupsRepository;
    private final PositionsRepository positionsRepository;
    private final ApplyRepository applyRepository;

    private void validateApplication(
            Integer age,
            String parentName,
            Boolean isStudent,
            String schoolName,
            String schoolGrade,
            String schoolClass
    ) {

        // 18歳未満は保護者名の入力を必須にする
        if (age != null && age < 18) {
            if (parentName == null || parentName.isBlank()) {
                throw new IllegalArgumentException(
                        "参加者が18歳未満の場合は保護者名を必ずご入力ください"
                );
            }
        }

        // 小中高校生は学校情報の入力を必須にする
        if (Boolean.TRUE.equals(isStudent)) {
            if (isNullOrBlank(schoolName) ||
                    isNullOrBlank(schoolGrade) ||
                    isNullOrBlank(schoolClass)) {

                throw new IllegalArgumentException(
                        "小中高生は学校名・学年・クラスを必ずご入力ください"
                );
            }
        }

    }

    public void create(ApplyForm form) {

        Applicants applicant = new Applicants();

        Groups group = groupsRepository.findById(form.getGroupId())
                        .orElseThrow();


        Positions position = positionsRepository.findById(form.getPositionId())
                        .orElseThrow();


        applicant.setGroup(group);
        applicant.setPosition(position);
        applicant.setApplicantName(
                InputNormalizer.removeSpaces(form.getApplicantName())
        );
        applicant.setKana(
                InputNormalizer.removeSpaces(form.getKana())
        );
        applicant.setAge(form.getAge());
        applicant.setAddress(form.getAddress());
        applicant.setEmail(form.getEmail());
        applicant.setTel(form.getTel());
        applicant.setParentName(
                InputNormalizer.removeSpaces(form.getParentName())
        );
        applicant.setIsStudent(form.getIsStudent());
        applicant.setSchoolName(form.getSchoolName());
        applicant.setSchoolGrade(form.getSchoolGrade());
        applicant.setSchoolClass(form.getSchoolClass());
        applicant.setNote(form.getNote());

        applicantsRepository.save(applicant);
    }

    private boolean isNullOrBlank(String str) {
        return str == null || str.isBlank();
    }

    public void registerApplication(ApplyForm form) {
        validateApplication(
                form.getAge(),
                form.getParentName(),
                form.getIsStudent(),
                form.getSchoolName(),
                form.getSchoolGrade(),
                form.getSchoolClass()
        );

        // 同一人物の重複申込チェック
        boolean duplicate = applicantsRepository
                .existsByApplicantNameAndKanaAndAgeAndTel(
                        InputNormalizer.removeSpaces(form.getApplicantName()),
                        InputNormalizer.removeSpaces(form.getKana()),
                        form.getAge(),
                        form.getTel()
                );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "この参加者はすでに申込済みです"
            );
        }

        create(form);
    }

    // マイページ申込情報取得用に詰め替え
    public ApplyDetailResponse findById(Long applicantId) {
        Applicants applicant = applyRepository.findById(applicantId)
                .orElseThrow();
        return new ApplyDetailResponse(
                        applicant.getApplicantId(),
                        applicant.getApplicantName(),
                        applicant.getKana(),
                        applicant.getAge(),
                        applicant.getAddress(),
                        applicant.getTel(),
                        applicant.getEmail(),
                        applicant.getParentName(),
                        applicant.getGroup().getGroupName(),
                        applicant.getPosition().getPositionName(),
                        applicant.getIsStudent(),
                        applicant.getSchoolName(),
                        applicant.getSchoolGrade(),
                        applicant.getSchoolClass(),
                        applicant.getNote()

        );
    }

    public void updateMyPage(Long applicantId, MyPageUpdateRequest request) {

        Applicants applicant = applyRepository.findById(applicantId)
                .orElseThrow();

        validateApplication(
                request.getAge(),
                request.getParentName(),
                request.getIsStudent(),
                request.getSchoolName(),
                request.getSchoolGrade(),
                request.getSchoolClass()
        );

        // 同一人物の重複申込チェック
        boolean duplicate = applicantsRepository
                .existsByApplicantNameAndKanaAndAgeAndTelAndApplicantIdNot(
                        InputNormalizer.removeSpaces(request.getApplicantName()),
                        InputNormalizer.removeSpaces(request.getKana()),
                        request.getAge(),
                        request.getTel(),
                        applicantId
                );
        if (duplicate) {
            throw new IllegalArgumentException(
                    "この参加者はすでに申込済みです"
            );
        }

        applicant.setApplicantName(
                InputNormalizer.removeSpaces(request.getApplicantName())
        );
        applicant.setKana(
                InputNormalizer.removeSpaces(request.getKana())
        );
        applicant.setAge(request.getAge());
        applicant.setAddress(request.getAddress());
        applicant.setEmail(request.getEmail());
        applicant.setTel(request.getTel());
        applicant.setParentName(
                InputNormalizer.removeSpaces(request.getParentName())
        );
        applicant.setIsStudent(request.getIsStudent());
        applicant.setSchoolName(request.getSchoolName());
        applicant.setSchoolGrade(request.getSchoolGrade());
        applicant.setSchoolClass(request.getSchoolClass());
        applicant.setNote(request.getNote());

        applyRepository.save(applicant);

    }
}
