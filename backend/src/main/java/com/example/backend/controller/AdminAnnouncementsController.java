package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.AnnouncementsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/announcements")
public class AdminAnnouncementsController {

    private final AnnouncementsService announcementService;

    public AdminAnnouncementsController(AnnouncementsService announcementsService) {
        this.announcementService = announcementsService;
    }

    // 管理画面：お知らせ一覧取得（マイページ用はMypageAnnounceController)
    @GetMapping
    public List<AdminAnnounceListResponse> getAnnouncements(
            Authentication authentication
    ) {
        return announcementService.findAnnouncements(authentication);
    }

    // 管理画面：お知らせ新規登録
    @PostMapping
    public void registerAnnouncement(
            @Valid @RequestBody AdminAnnouncementForm form,
            Authentication authentication
    ) {
        announcementService.registerAnnouncement(form, authentication);
    }

    // 管理画面：ポジション詳細取得
    @GetMapping("/{announcementId}")
    public AdminAnnouncementDetailResponse findById(
            @PathVariable Long announcementId,
            Authentication authentication
    ) {
        return announcementService.findById(
                announcementId,
                authentication
        );
    }

    // 管理画面：お知らせ編集
    @PutMapping("/{announcementId}")
    public ResponseEntity<?> updateAnnouncement(
            @PathVariable Long announcementId,
            @Valid @RequestBody AdminAnnouncementForm form,
            Authentication authentication
    ) {

        announcementService.updateAnnouncement(
                announcementId,
                form,
                authentication
        );

        return ResponseEntity.ok().build();
    }

    // 管理画面：一覧お知らせ公開状態変更
    @PatchMapping("/{announcementId}/publish")
    public ResponseEntity<?> updateAnnouncementPublished(
            @PathVariable Long announcementId,
            @RequestBody AdminAnnouncementPublishedForm form,
            Authentication authentication
    ) {

        announcementService.updateAnnouncementPublished(
                announcementId,
                form.getIsPublished(),
                authentication
        );

        return ResponseEntity.ok().build();
    }

}
