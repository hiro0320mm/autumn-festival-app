package com.example.backend.controller;

import com.example.backend.dto.AdminAnnounceListResponse;
import com.example.backend.dto.AdminPositionListResponse;
import com.example.backend.service.AnnouncementsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/announcements")
public class AdminAnnouncementsController {

    private final AnnouncementsService announcementService;

    public AdminAnnouncementsController(AnnouncementsService announcementsService) {
        this.announcementService = announcementsService;
    }

    @GetMapping
    public List<AdminAnnounceListResponse> getAnnouncements(
            Authentication authentication
    ) {
        return announcementService.findAnnouncements(authentication);
    }
}
