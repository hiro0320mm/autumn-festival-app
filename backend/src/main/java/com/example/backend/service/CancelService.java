package com.example.backend.service;

import com.example.backend.entity.Applicants;
import com.example.backend.entity.CancelStatus;
import com.example.backend.entity.Role;
import com.example.backend.entity.Staffs;
import com.example.backend.repository.ApplicantsRepository;
import com.example.backend.repository.StaffsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CancelService {

    private final ApplicantsRepository applicantsRepository;
    private final StaffsRepository staffsRepository;

    // マイページ：キャンセル依頼
    public void requestCancel(Authentication authentication) {

        Long applicantId = Long.valueOf(authentication.getName());

        Applicants applicant = applicantsRepository.findById(applicantId)
                .orElseThrow(() ->
                        new IllegalArgumentException("申込者が見つかりません")
                );

            // 現在キャンセルされていない場合(cancelStatus == NONE)のみ依頼可能
            if (applicant.getCancelStatus() != CancelStatus.NONE) {
                throw new IllegalArgumentException("すでにキャンセル依頼中です。担当者の確認をお待ちください");
            }

            applicant.setCancelStatus(CancelStatus.REQUESTED);

            applicantsRepository.save(applicant);
    }

    // 管理画面：キャンセル依頼を承認
    public void approveCancel(
            Long applicantId,
            Authentication authentication
    ) {

        Applicants applicant = findApplicantWithPermission (
                applicantId,
                authentication
        );

        // キャンセル依頼中の場合のみ承認可能
        if (applicant.getCancelStatus() != CancelStatus.REQUESTED) {
            throw new IllegalArgumentException("キャンセル承認できる状態ではありません");
        }

        applicant.setCancelStatus(CancelStatus.CANCELED);

        applicantsRepository.save(applicant);
    }

    // 管理画面：直接キャンセル
    public void cancelDirectly(
            Long applicantId,
            Authentication authentication
    ) {

        Applicants applicant = findApplicantWithPermission(
                applicantId,
                authentication
        );

        // まだキャンセルされていない場合のみ直接キャンセル可能
        if (applicant.getCancelStatus() != CancelStatus.NONE) {
            throw new IllegalArgumentException("キャンセルできる状態ではありません");
        }

        applicant.setCancelStatus(CancelStatus.CANCELED);

        applicantsRepository.save(applicant);
    }

    // 管理画面：申込者取得 + 権限チェック
    private Applicants findApplicantWithPermission(
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
                        new IllegalArgumentException("管理者が見つかりません")
                );

        if (staff.getRole() == Role.ROLE_ADMIN) {

            if (!applicant.getGroup().getGroupId().equals(staff.getGroup().getGroupId())) {
                throw new IllegalArgumentException("この申込者を操作する権限がありません");
            }

        } else if (staff.getRole() != Role.ROLE_SUPER_ADMIN) {

            throw new IllegalArgumentException("権限が不正です");

        }

        return applicant;

    }

}
