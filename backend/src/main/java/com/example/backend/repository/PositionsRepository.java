package com.example.backend.repository;

import com.example.backend.entity.Positions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PositionsRepository extends JpaRepository<Positions, Long> {

    // 申込トップページ：募集中のみ取得
    List<Positions> findByGroupGroupIdAndRecruitmentStatusTrue(Long groupGroupId);

    // 管理画面：すべてのポジションを取得
    List<Positions> findByGroup_GroupId(Long groupId);

    // 管理画面：新規登録
    boolean existsByGroup_GroupIdAndPositionName(
            Long groupId,
            String positionName
    );

    // 山車組とポジションの組み合わせチェック
    boolean existsByPositionIdAndGroup_GroupId(
            Long positionId,
            Long groupId
    );

    // 管理画面：編集時のポジション名重複チェック
    boolean existsByGroup_GroupIdAndPositionNameAndPositionIdNot(
            Long groupId,
            String positionName,
            Long positionId
    );

    // 管理画面：募集状況のみ変更
    @Modifying
    @Query("""
        UPDATE Positions p
        SET p.recruitmentStatus = :recruitmentStatus
        WHERE p.positionId = :positionId
    """)
    void updateRecruitmentStatus(
            @Param("positionId") Long positionId,
            @Param("recruitmentStatus") Boolean recruitmentStatus
    );
}
