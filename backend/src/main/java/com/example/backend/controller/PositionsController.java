package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.PositionsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/positions")
public class PositionsController {

    private final PositionsService positionsService;

    public PositionsController(PositionsService positionsService) {
        this.positionsService = positionsService;
    }

    // 管理画面：ポジション一覧取得
    @GetMapping
    public List<AdminPositionListResponse> findPositions(
            Authentication authentication
    ) {
        return positionsService.findPositions(authentication);
    }

    // 管理画面：ポジション詳細取得
    @GetMapping("/{positionId}")
    public AdminPositionDetailResponse findById (
            @PathVariable Long positionId,
            Authentication authentication
    ) {
        return positionsService.findById(positionId, authentication);
    }

    // 管理画面：ポジション新規登録
    @PostMapping
    public ResponseEntity<String> registerPosition(
            @Valid @RequestBody AdminPositionForm form,
            Authentication authentication
    ) {
        positionsService.registerPosition(form, authentication);

        return ResponseEntity.ok("ポジションを登録しました");
    }

    // 管理画面：ポジション更新
    @PutMapping("/{positionId}")
    public ResponseEntity<?> updatePosition(
            @PathVariable Long positionId,
            @Valid @RequestBody AdminPositionUpdateRequest form,
            Authentication authentication) {

        positionsService.updatePosition(positionId, form, authentication);

        return ResponseEntity.ok().build();
    }

}
