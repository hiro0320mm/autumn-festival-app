package com.example.backend.controller;

import com.example.backend.dto.ApplyDetailResponse;
import com.example.backend.dto.ApplyForm;
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
    public ResponseEntity<String> registerApplication(@Valid @RequestBody ApplyForm form) {
        applyService.registerApplication(form);
        return ResponseEntity.ok("申込を受け付けました");
    }

    // 個別の申込内容取得　/api/appilications/{applicantId}
    @GetMapping("/{applicantId}")
    public ApplyDetailResponse getApplicant(@PathVariable Long applicantId) {
        return applyService.findById(applicantId);
    }

}
