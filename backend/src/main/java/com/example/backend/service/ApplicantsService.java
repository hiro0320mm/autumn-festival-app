package com.example.backend.service;

import com.example.backend.dto.AdminApplicantDetailResponse;
import com.example.backend.dto.AdminApplicantForm;
import com.example.backend.dto.AdminApplicantListResponse;
import com.example.backend.dto.AdminApplicantUpdateRequest;
import com.example.backend.entity.*;
import com.example.backend.repository.ApplicantsRepository;
import com.example.backend.repository.GroupsRepository;
import com.example.backend.repository.PositionsRepository;
import com.example.backend.repository.StaffsRepository;
import com.example.backend.util.InputNormalizer;
import com.example.backend.validator.ApplicationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicantsService {

    private final GroupsRepository groupsRepository;
    private final StaffsRepository staffsRepository;
    private final PositionsRepository positionsRepository;
    private final ApplicantsRepository applicantsRepository;
    private final ApplicationValidator applicationValidator;

    // 管理画面：申込者一覧
    public List<AdminApplicantListResponse> findApplicants(
            Authentication authentication
    ) {
        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        List<Applicants> applicants;

        if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {
            // 特権管理者：すべての申込者を取得
            applicants = applicantsRepository.findAll();

        } else if (staff.getRole() == Role.ROLE_ADMIN) {

            // 一般管理者：ログインユーザーに紐づいている山車組の申込者のみ取得
            applicants = applicantsRepository
                    .findByGroup_GroupId(staff.getGroup().getGroupId());

        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        return applicants.stream()
                .map(applicant -> new AdminApplicantListResponse(
                        applicant.getApplicantId(),
                        applicant.getReceptionNumber(),
                        applicant.getGroup().getGroupName(),
                        applicant.getApplicantName(),
                        applicant.getKana(),
                        applicant.getAge(),
                        applicant.getPosition().getPositionName(),
                        applicant.getAddress(),
                        applicant.getTel(),
                        applicant.getSchoolName(),
                        applicant.getSchoolGrade(),
                        applicant.getNote(),
                        applicant.getStaffMemo(),
                        applicant.getCancelStatus()
                ))
                .toList();
    }

    // 管理画面：申込者詳細
    public AdminApplicantDetailResponse findById(
            Long applicantId,
            Authentication authentication
    ) {
        Applicants applicant = applicantsRepository.findById(applicantId)
                .orElseThrow(() ->
                        new IllegalArgumentException("申込者が見つかりません")
                );

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        if (staff.getRole() == Role.ROLE_ADMIN) {

            if (!applicant.getGroup().getGroupId()
            .equals(staff.getGroup().getGroupId())) {
                throw new IllegalArgumentException("この申込者を閲覧する権限がありません");
            }
        } else if (staff.getRole() != Role.ROLE_SUPER_ADMIN) {
            throw new IllegalArgumentException("権限が不正です");
        }

        return new AdminApplicantDetailResponse(
                applicant.getGroup().getGroupId(),
                applicant.getApplicantId(),
                applicant.getReceptionNumber(),
                applicant.getGroup().getGroupName(),
                applicant.getApplicantName(),
                applicant.getKana(),
                applicant.getAge(),
                applicant.getPosition().getPositionName(),
                applicant.getAddress(),
                applicant.getTel(),
                applicant.getEmail(),
                applicant.getParentName(),
                applicant.getIsStudent(),
                applicant.getSchoolName(),
                applicant.getSchoolGrade(),
                applicant.getSchoolClass(),
                applicant.getNote(),
                applicant.getStaffMemo(),
                applicant.getCancelStatus(),
                applicant.getCreatedBy(),
                applicant.getCreatedAt(),
                applicant.getUpdatedBy(),
                applicant.getUpdatedAt()
        );
    }

    // 管理画面：新規登録
    public void registerApplication(
            AdminApplicantForm form,
            Authentication authentication
    ) {

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        Groups group;

        if (staff.getRole() == Role.ROLE_ADMIN) {
            // 一般管理者：ログイン情報に紐づいた山車組に申込者を登録
            group = staff.getGroup();
        } else if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {
            // 特権管理者：指定された山車組に申込者を登録
            group = groupsRepository.findById(form.getGroupId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("指定された山車組がみつかりません")
                    );
        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        applicationValidator.validate(
                form.getAge(),
                form.getParentName(),
                form.getIsStudent(),
                form.getSchoolName(),
                form.getSchoolGrade(),
                form.getSchoolClass()
        );

        // 重複申込のチェック
        boolean duplicate = applicantsRepository
                .existsByApplicantNameAndKanaAndAgeAndTel(
                        InputNormalizer.removeSpaces(form.getApplicantName()),
                        InputNormalizer.removeSpaces(form.getKana()),
                        form.getAge(),
                        form.getTel()
                );
        if (duplicate) {
            throw new IllegalArgumentException("この参加者はすでに申込済みです");
        }

        Applicants applicant = new Applicants();

        applicant.setGroup(group);

        Positions position = positionsRepository.findById(form.getPositionId())
                .orElseThrow(() ->
                        new IllegalArgumentException("指定されたポジションが見つかりません")
                );

        // 山車組とポジションが正しく紐づいていない場合はエラーを返す
        if (!position.getGroup().getGroupId().equals(group.getGroupId())) {
            throw new IllegalArgumentException("指定されたポジションは、この山車組に登録できません");
        }
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
        applicant.setStaffMemo(form.getStaffMemo());

        applicantsRepository.save(applicant);

    }

    // 管理画面：編集
    public void updateApplication(
            Long applicantId,
            AdminApplicantUpdateRequest request,
            Authentication authentication
    ) {

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        Applicants applicant = applicantsRepository.findById(applicantId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定された申込者は存在しません")
                );

        Groups group;

        if (staff.getRole() == Role.ROLE_ADMIN) {
            // 一般管理者：ログイン情報に紐づいた山車組に申込者を登録
            group = staff.getGroup();

            if (!applicant.getGroup().getGroupId().equals(group.getGroupId())) {
                throw new IllegalArgumentException("この申込者を編集する権限がありません");
            }

        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        applicationValidator.validate(
                request.age(),
                request.parentName(),
                request.isStudent(),
                request.schoolName(),
                request.schoolGrade(),
                request.schoolClass()
        );

        // 重複申込のチェック
        boolean duplicate = applicantsRepository
                .existsByApplicantNameAndKanaAndAgeAndTelAndApplicantIdNot(
                        InputNormalizer.removeSpaces(request.applicantName()),
                        InputNormalizer.removeSpaces(request.kana()),
                        request.age(),
                        request.tel(),
                        applicantId
                );
        if (duplicate) {
            throw new IllegalArgumentException("この参加者はすでに申込済みです");
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
        applicant.setStaffMemo(request.staffMemo());

        applicantsRepository.save(applicant);
    }

    // 管理画面：削除
    public void deleteApplicant(
            Long applicantId,
            Authentication authentication
    ) {

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        Applicants applicant = applicantsRepository.findById(applicantId)
                .orElseThrow(() ->
                        new IllegalArgumentException("指定された申込者は存在しません")
                );

        if (staff.getRole() == Role.ROLE_ADMIN) {

            if (!applicant.getGroup().getGroupId()
            .equals(staff.getGroup().getGroupId())) {
                throw new IllegalArgumentException("この申込者を削除する権限がありません");
            }

        } else if (staff.getRole() != Role.ROLE_SUPER_ADMIN) {

            throw new IllegalArgumentException("権限が不正です");

        }

        applicantsRepository.delete(applicant);
    }
}
