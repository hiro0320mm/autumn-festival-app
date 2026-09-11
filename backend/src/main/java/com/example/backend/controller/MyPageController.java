package com.example.backend.controller;

import com.example.backend.dto.ApplyDetailResponse;
import com.example.backend.dto.MyPageUpdateRequest;
import com.example.backend.service.ApplyService;
import com.example.backend.service.CancelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {

    private final ApplyService applyService;
    private final CancelService cancelService;

    public MyPageController(
            ApplyService applyService,
            CancelService cancelService
    ) {
        this.applyService = applyService;
        this.cancelService = cancelService;
    }

    // 申込内容取得
    @GetMapping
    public ApplyDetailResponse getMyPage(Authentication authentication){

        Long applicantId = (Long) authentication.getPrincipal();

        return applyService.findById(applicantId);

    }

    // 申込内容修正
    @PutMapping
    public ResponseEntity<Void> updateMyPage(
            Authentication authentication,
            @Valid @RequestBody MyPageUpdateRequest request
    ) {

        Long applicantId = (Long) authentication.getPrincipal();

        applyService.updateMyPage(applicantId, request);

        return ResponseEntity.noContent().build();

    }

    // キャンセル依頼
    @PutMapping("/request")
    public ResponseEntity<Void> requestCancel(
            Authentication authentication
    ) {
        cancelService.requestCancel(authentication);
        return ResponseEntity.ok().build();
    }
}
