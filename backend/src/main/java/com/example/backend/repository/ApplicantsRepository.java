package com.example.backend.repository;

import com.example.backend.entity.Applicants;
import org.springframework.data.jpa.repository.JpaRepository;

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

}
