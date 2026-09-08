package com.example.backend.controller;

import com.example.backend.dto.AdminGroupDetailResponse;
import com.example.backend.dto.AdminGroupUpdateRequest;
import com.example.backend.service.GroupsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/groups")
public class AdminGroupsController {

    private final GroupsService groupsService;

    public AdminGroupsController(GroupsService groupsService) {
        this.groupsService = groupsService;
    }

    // 管理画面：山車組詳細取得
    @GetMapping("/{groupId}")
    public AdminGroupDetailResponse findById (
            @PathVariable Long groupId,
            Authentication authentication
    ) {
        return groupsService.findById(groupId, authentication);
    }

    // 管理画面：山車組情報更新
    @PutMapping("/{groupId}")
    public ResponseEntity<Void> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody AdminGroupUpdateRequest request,
            Authentication authentication
    ) {
        groupsService.updateGroup(
                groupId,
                request,
                authentication
        );

        return ResponseEntity.noContent().build();
    }

}
