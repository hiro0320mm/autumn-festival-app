package com.example.backend.repository;

import com.example.backend.entity.Positions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionsRepository extends JpaRepository<Positions, Long> {
    List<Positions> findByGroupGroupIdAndRecruitmentStatusTrue(Long groupGroupId);
}
