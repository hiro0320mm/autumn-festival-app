package com.example.backend.controller;

import com.example.backend.dto.AdminAnnounceListResponse;
import com.example.backend.dto.AdminAnnouncementForm;
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

}
