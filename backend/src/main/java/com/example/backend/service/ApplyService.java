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
import com.example.backend.validator.ApplicationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApplyService {

    private final ApplicantsRepository applicantsRepository;
    private final GroupsRepository groupsRepository;
    private final PositionsRepository positionsRepository;
    private final ApplyRepository applyRepository;
    private final ApplicationValidator applicationValidator;

    public Applicants create(ApplyForm form) {

        Applicants applicant = new Applicants();

        Groups group = groupsRepository.findById(form.getGroupId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("指定された山車組は存在しません")
                        );

        Positions position = positionsRepository.findById(form.getPositionId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("指定されたポジションは存在しません")
                        );
        // 山車組とポジションが正しく紐づいていない場合はエラーを返す
        if (!position.getGroup().getGroupId().equals(group.getGroupId())) {
            throw new IllegalArgumentException("指定されたポジションは、この山車組に登録できません");
        }

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

        return applicantsRepository.save(applicant);
    }

    // マイページ：申込情報取得
    public ApplyDetailResponse findById(Long applicantId) {

        Applicants applicant = applyRepository.findById(applicantId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定された申込者は存在しません")
                );

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

    // 参加申込フォームの内容確認
    public void validateApply(ApplyForm form) {
        applicationValidator.validate(
                form.getAge(),
                form.getParentName(),
                form.getIsStudent(),
                form.getSchoolName(),
                form.getSchoolGrade(),
                form.getSchoolClass()
        );
    }

    // 参加申込フォームからの登録処理
    public Applicants registerApplication(ApplyForm form) {

        applicationValidator.validate(
                form.getAge(),
                form.getParentName(),
                form.getIsStudent(),
                form.getSchoolName(),
                form.getSchoolGrade(),
                form.getSchoolClass()
        );

        // 山車組とポジションの組み合わせチェック
        boolean validPosition = positionsRepository
                .existsByPositionIdAndGroup_GroupId(
                        form.getPositionId(),
                        form.getGroupId()
                );

        if (!validPosition) {
            throw new IllegalArgumentException(
                    "選択した山車組とポジションの組み合わせが正しくありません"
            );
        }

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

        return create(form);
    }

    // マイページ：編集
    public void updateMyPage(Long applicantId, MyPageUpdateRequest request) {

        Applicants applicant = applyRepository.findById(applicantId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定された申込者は存在しません")
                );

        applicationValidator.validate(
                request.age(),
                request.parentName(),
                request.isStudent(),
                request.schoolName(),
                request.schoolGrade(),
                request.schoolClass()
        );

        // 同一人物の重複チェック
        boolean duplicate = applicantsRepository
                .existsByApplicantNameAndKanaAndAgeAndTelAndApplicantIdNot(
                        InputNormalizer.removeSpaces(request.applicantName()),
                        InputNormalizer.removeSpaces(request.kana()),
                        request.age(),
                        request.tel(),
                        applicantId
                );
        if (duplicate) {
            throw new IllegalArgumentException(
                    "この参加者はすでに申込済みです"
            );
        }

        applicant.setApplicantName(
                InputNormalizer.removeSpaces(request.applicantName())
        );
        applicant.setKana(
                InputNormalizer.removeSpaces(request.kana())
        );
        applicant.setAge(request.age());
        applicant.setAddress(request.address());
        applicant.setEmail(request.email());
        applicant.setTel(request.tel());
        applicant.setParentName(
                InputNormalizer.removeSpaces(request.parentName())
        );
        applicant.setIsStudent(request.isStudent());
        applicant.setSchoolName(request.schoolName());
        applicant.setSchoolGrade(request.schoolGrade());
        applicant.setSchoolClass(request.schoolClass());
        applicant.setNote(request.note());

        applyRepository.save(applicant);

    }
}
