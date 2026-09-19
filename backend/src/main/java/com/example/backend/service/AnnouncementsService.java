package com.example.backend.service;

import com.example.backend.dto.AdminAnnounceListResponse;
import com.example.backend.dto.AdminAnnouncementForm;
import com.example.backend.dto.MyPageAnnouncementResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.AnnouncementRepository;
import com.example.backend.repository.ApplicantsRepository;
import com.example.backend.repository.GroupsRepository;
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
    private final GroupsRepository groupsRepository;
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

        // 管理画面：権限ごとの設定
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

    // 管理画面：お知らせ新規登録
    public void registerAnnouncement(
            AdminAnnouncementForm form,
            Authentication authentication
    ) {

        // ログイン中の管理者を取得
        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        Groups group;

        if (staff.getRole() == Role.ROLE_ADMIN) {

            group = staff.getGroup();

        } else if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {

            group = null;

        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        Announcements announcement = new Announcements();

        announcement.setGroup(group);
        announcement.setTitle(form.getTitle());
        announcement.setContent(form.getContent());
        announcement.setIsPublished(form.getIsPublished());

        announcementRepository.save(announcement);
    }

    //　管理画面：お知らせ編集
    public void updateAnnouncement(
            Long announcementId,
            AdminAnnouncementForm form,
            Authentication authentication
    ) {

        // ログイン中の管理者を取得
        String staffName = authentication.getName();

        Staffs staff = staffsRepository.findByStaffName(staffName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("管理者名が見つかりません")
                );

        // 編集対象のお知らせを取得
        Announcements announcement =
                announcementRepository.findById(announcementId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("お知らせが見つかりません")
                        );

        // 権限チェック
        if (staff.getRole() == Role.ROLE_ADMIN) {

            // 山車組担当者は所属する山車組のお知らせだけ編集可能
            if (announcement.getGroup() == null) {
                throw new IllegalArgumentException(
                        "このお知らせを編集する権限がありません"
                );
            }

            if (!staff.getGroup().getGroupId()
                    .equals(announcement.getGroup().getGroupId())) {
                throw new IllegalArgumentException(
                        "このお知らせを編集する権限がありません"
                );
            }

        } else if (staff.getRole() == Role.ROLE_SUPER_ADMIN) {

            // 特権管理者は全体向けのお知らせだけ編集可能
            if (announcement.getGroup() != null) {
                throw new IllegalArgumentException(
                        "全体向けのお知らせのみ編集できます"
                );
            }

        } else {
            throw new IllegalArgumentException("権限が不正です");
        }

        announcement.setTitle(form.getTitle());
        announcement.setContent(form.getContent());
        announcement.setIsPublished(form.getIsPublished());

        announcementRepository.save(announcement);
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
