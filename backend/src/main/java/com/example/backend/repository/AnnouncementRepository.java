package com.example.backend.repository;

import com.example.backend.entity.Announcements;
import com.example.backend.entity.Positions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcements, Long> {

    // お知らせ取得：マイページ表示用
    @Query("""
        SELECT a
        FROM Announcements a
        WHERE a.isPublished = true
          AND (a.group IS NULL OR a.group.groupId = :groupId)
        ORDER BY a.createdAt DESC
        """)
    List<Announcements> findPublishedAnnouncementsByGroupId(
            @Param("groupId") Long groupId
    );

    // お知らせ取得：山車組担当者用
    @Query("""
    SELECT a
    FROM Announcements a
    WHERE a.group IS NULL
       OR a.group.groupId = :groupId
    ORDER BY a.createdAt DESC
    """)
    List<Announcements> findAnnouncementsByGroupId(
            @Param("groupId") Long groupId
    );

    // お知らせ取得：特権管理者用（全件取得）
    List<Announcements> findAllByOrderByCreatedAtDesc();
}
