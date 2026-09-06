package com.example.backend.controller;

import com.example.backend.service.StaffsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class StaffsController {

    private final StaffsService staffsService;

}
