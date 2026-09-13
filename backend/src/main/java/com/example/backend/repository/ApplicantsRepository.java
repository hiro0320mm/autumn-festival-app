package com.example.backend.repository;

import com.example.backend.entity.Applicants;
import com.example.backend.entity.CancelStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicantsRepository extends JpaRepository<Applicants, Long> {

    boolean existsByApplicantNameAndKanaAndAgeAndTel(
      String applicantName,
      String kana,
      Integer age,
      String tel
    );

    boolean existsByApplicantNameAndKanaAndAgeAndTelAndApplicantIdNot(
            String applicantName,
            String kana,
            Integer age,
            String tel,
            Long applicantId
    );

    List<Applicants> findByGroup_GroupId(Long groupId);

    // 管理画面：各ポジション申込者数取得
    long countByPosition_PositionIdAndCancelStatusNot(
            Long positionId,
            CancelStatus cancelStatus
    );

}
