package com.example.backend.controller;

import com.example.backend.dto.ApplyDetailResponse;
import com.example.backend.dto.ApplyForm;
import com.example.backend.dto.ApplyResponse;
import com.example.backend.entity.Applicants;
import com.example.backend.service.ApplyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/apply")
public class ApplyController {

    private final ApplyService applyService;

    public ApplyController(ApplyService applyService) {
        this.applyService = applyService;
    }

    // 参加申込フォームからの送信
    @PostMapping
    public ResponseEntity<ApplyResponse> registerApplication(@Valid @RequestBody ApplyForm form) {

        Applicants applicant = applyService.registerApplication(form);

        ApplyResponse response = new ApplyResponse(
                applicant.getReceptionNumber()
        );

        return ResponseEntity.ok(response);
    }

    // 参加申込フォーム入力確認画面取得
    @PostMapping("/validate")
    public ResponseEntity<Void> validateApply(@Valid @RequestBody ApplyForm form) {
        applyService.validateApply(form);

        return ResponseEntity.ok().build();
    }

    // 個別の申込内容取得　/api/appilications/{applicantId}
    @GetMapping("/{applicantId}")
    public ApplyDetailResponse getApplicant(@PathVariable Long applicantId) {
        return applyService.findById(applicantId);
    }

}
