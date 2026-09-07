package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.ApplicantsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applicants")
public class ApplicantsController {

    private final ApplicantsService applicantsService;

    public ApplicantsController(ApplicantsService applicantsService) {
        this.applicantsService = applicantsService;
    }

    @GetMapping
    public List<AdminApplicantListResponse> findApplicants(
            Authentication authentication
    ) {
        return applicantsService.findApplicants(authentication);
    }

    @GetMapping("/{applicantId}")
    public AdminApplicantDetailResponse findById(
            @PathVariable Long applicantId,
            Authentication authentication
    ) {
        return applicantsService.findById(applicantId, authentication);
    }

    @PostMapping
    public ResponseEntity<String> registerApplication(
            @Valid @RequestBody AdminApplicantForm form,
            Authentication authentication
    ) {
        applicantsService.registerApplication(form, authentication);

        return ResponseEntity.ok("申込を登録しました");
    }

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

    @DeleteMapping("/{applicantId}")
    public ResponseEntity<Void> deleteApplicant(
            @PathVariable Long applicantId,
            Authentication authentication
    ) {
        applicantsService.deleteApplicant(applicantId, authentication);

        return ResponseEntity.noContent().build();
    }

}
