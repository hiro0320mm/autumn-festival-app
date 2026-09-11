package com.example.backend.controller;

import com.example.backend.dto.ApplyDetailResponse;
import com.example.backend.dto.MyPageUpdateRequest;
import com.example.backend.service.ApplyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {

    private final ApplyService applyService;

    public MyPageController(ApplyService applyService) {
        this.applyService = applyService;
    }

    @GetMapping
    public ApplyDetailResponse getMyPage(Authentication authentication){

        Long applicantId = (Long) authentication.getPrincipal();

        return applyService.findById(applicantId);

    }

    @PutMapping
    public ResponseEntity<Void> updateMyPage(
            Authentication authentication,
            @Valid @RequestBody MyPageUpdateRequest request
    ) {

        Long applicantId = (Long) authentication.getPrincipal();

        applyService.updateMyPage(applicantId, request);

        return ResponseEntity.noContent().build();

    }
}
