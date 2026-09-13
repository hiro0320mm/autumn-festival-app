package com.example.backend.controller;


import com.example.backend.entity.Staffs;
import com.example.backend.repository.StaffsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final StaffsRepository staffsRepository;

    public AdminController(StaffsRepository staffsRepository) {
        this.staffsRepository = staffsRepository;
    }


    @GetMapping("/me")
    public ResponseEntity<?> checkLogin(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Staffs staff = staffsRepository.findByStaffName(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("管理者が見つかりません"));

        Map<String, Object> response = new HashMap<>();

        response.put("authenticated", true);
        response.put("role", staff.getRole().name());
        response.put(
                "groupId",
                staff.getGroup() != null
                        ? staff.getGroup().getGroupId()
                        : null
        );
        response.put("staffName", staff.getStaffName());

        return ResponseEntity.ok(response);
    }

}
