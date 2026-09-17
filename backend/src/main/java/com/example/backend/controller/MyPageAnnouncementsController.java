package com.example.backend.controller;

import com.example.backend.dto.AdminAnnounceListResponse;
import com.example.backend.dto.MyPageAnnouncementResponse;
import com.example.backend.service.AnnouncementsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mypage/announcements")
public class MyPageAnnouncementsController {

    private final AnnouncementsService announcementService;

    public MyPageAnnouncementsController(AnnouncementsService announcementsService) {
        this.announcementService = announcementsService;
    }

    @GetMapping
    public List<MyPageAnnouncementResponse> findPublishedAnnouncements(
            Authentication authentication
    ) {
        return announcementService.findPublishedAnnouncements(authentication);
    }
}
