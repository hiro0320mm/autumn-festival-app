package com.example.backend.service;

import com.example.backend.dto.AdminAnnounceListResponse;
import com.example.backend.dto.AdminApplicantListResponse;
import com.example.backend.dto.MyPageAnnouncementResponse;
import com.example.backend.entity.Announcements;
import com.example.backend.entity.Applicants;
import com.example.backend.entity.Role;
import com.example.backend.entity.Staffs;
import com.example.backend.repository.AnnouncementRepository;
import com.example.backend.repository.ApplicantsRepository;
import com.example.backend.repository.StaffsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementsService {

    private final AnnouncementRepository announcementRepository;
    private final ApplicantsRepository applicantsRepository;
    private final StaffsRepository staffsRepository;

    // お知らせ一覧取得
    public List<AdminAnnounceListResponse> findAnnouncements(
        Authentication authentication
    ) {

        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者が見つかりません")
                );

        List<Announcements> announcements;

        // 管理画面：お知らせ一覧取得
        if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {
            // 特権管理者は表示・非表示に関わらず全件取得
            announcements = announcementRepository.findAllByOrderByCreatedAtDesc();

        } else if (staff.getRole() == Role.ROLE_ADMIN) {
            Long groupId = staff.getGroup().getGroupId();
            // 山車組担当者はグループIDに紐づくお知らせだけ取得
            announcements = announcementRepository.findAnnouncementsByGroupId(groupId);

        } else {
            throw new IllegalArgumentException("一覧を閲覧する権限がありません");
        }

        return announcements
                .stream()
                .map(announcement -> new AdminAnnounceListResponse(
                        announcement.getAnnouncementId(),
                        announcement.getGroup() != null
                                ? announcement.getGroup().getGroupId()
                                : null,
                        announcement.getTitle(),
                        announcement.getContent(),
                        announcement.getIsPublished(),
                        announcement.getCreatedBy(),
                        announcement.getCreatedAt(),
                        announcement.getUpdatedBy(),
                        announcement.getUpdatedAt()
                ))
                .toList();

    }

    // マイページ用：お知らせ一覧取得
    public List<MyPageAnnouncementResponse> findPublishedAnnouncements(
            Authentication authentication
    ) {
        String applicantId = authentication.getName();
        Applicants applicant = applicantsRepository.findById(Long.valueOf(applicantId))
                .orElseThrow(() ->
                        new UsernameNotFoundException("申込者が見つかりません")
                );

        Long groupId = applicant.getGroup().getGroupId();

        // 申込ユーザーはグループIDに紐づくお知らせだけ取得
        List<Announcements> announcements =
                announcementRepository.findPublishedAnnouncementsByGroupId(groupId);

        return announcements.stream()
                .map(announcement -> new MyPageAnnouncementResponse(
                        announcement.getAnnouncementId(),
                        announcement.getTitle(),
                        announcement.getContent(),
                        announcement.getCreatedBy(),
                        announcement.getCreatedAt(),
                        announcement.getUpdatedBy(),
                        announcement.getUpdatedAt()
                ))
                .toList();
    }

}
