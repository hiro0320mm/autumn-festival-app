package com.example.backend.repository;

import com.example.backend.entity.Applicants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplyRepository extends JpaRepository<Applicants, Long> {
    Optional<Applicants> findByReceptionNumber(String receptionNumber);
}
