package com.example.backend.repository;

import com.example.backend.entity.Applicants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MyPageLoginRepository extends JpaRepository<Applicants, Long> {
    Optional<Applicants> findByApplicantNameAndTelAndReceptionNumber(
            String applicantName,
            String tel,
            String receptionNumber
    );
}
