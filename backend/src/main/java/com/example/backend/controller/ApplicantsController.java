package com.example.backend.controller;

import com.example.backend.dto.ApplicantListResponse;
import com.example.backend.service.ApplicantsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applicants")
public class ApplicantsController {

    private final ApplicantsService applicantsService;

    public ApplicantsController(ApplicantsService applicantsService) {
        this.applicantsService = applicantsService;
    }

    @GetMapping
    public List<ApplicantListResponse> findAll() {
        return applicantsService.findAll();
    }

}
