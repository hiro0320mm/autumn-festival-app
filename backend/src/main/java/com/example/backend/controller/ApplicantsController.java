package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.ApplicantsService;
import com.example.backend.service.CancelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applicants")
public class ApplicantsController {

    private final ApplicantsService applicantsService;
    private final CancelService cancelService;

    public ApplicantsController(ApplicantsService applicantsService, CancelService cancelService) {
        this.applicantsService = applicantsService;
        this.cancelService = cancelService;
    }

    // 管理画面：申込者一覧取得
    @GetMapping
    public List<AdminApplicantListResponse> findApplicants(
            Authentication authentication
    ) {
        return applicantsService.findApplicants(authentication);
    }

    // 管理画面：申込者詳細取得
    @GetMapping("/{applicantId}")
    public AdminApplicantDetailResponse findById(
            @PathVariable Long applicantId,
            Authentication authentication
    ) {
        return applicantsService.findById(applicantId, authentication);
    }

    // 管理画面：申込者新規登録
    @PostMapping
    public ResponseEntity<String> registerApplication(
            @Valid @RequestBody AdminApplicantForm form,
            Authentication authentication
    ) {
        applicantsService.registerApplication(form, authentication);

        return ResponseEntity.ok("申込を登録しました");
    }

    // 管理画面：選択した申込者を更新
    @PutMapping("/{applicantId}")
    public ResponseEntity<Void> updateApplication(
            @PathVariable Long applicantId,
            @Valid @RequestBody AdminApplicantUpdateRequest request,
            Authentication authentication
    ) {
        applicantsService.updateApplication(
                applicantId,
                request,
                authentication
        );

        return ResponseEntity.noContent().build();
    }

    // 管理画面：指定した申込者を削除
    @DeleteMapping("/{applicantId}")
    public ResponseEntity<Void> deleteApplicant(
            @PathVariable Long applicantId,
            Authentication authentication
    ) {
        applicantsService.deleteApplicant(applicantId, authentication);

        return ResponseEntity.noContent().build();
    }

    // 管理画面：キャンセル依頼を承認
    @PutMapping("/{applicantId}/approve")
    public ResponseEntity<Void> approveCancel(
            @PathVariable Long applicantId,
            Authentication authentication
    ) {
        cancelService.approveCancel(applicantId, authentication);
        return ResponseEntity.ok().build();
    }

    // 管理画面：直接キャンセル
    @PutMapping("/{applicantId}/cancel")
    public ResponseEntity<Void> cancelDirectly(
            @PathVariable Long applicantId,
            Authentication authentication
    ) {
        cancelService.cancelDirectly(applicantId, authentication);
        return ResponseEntity.ok().build();
    }

}
