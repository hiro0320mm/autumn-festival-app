package com.example.backend.repository;

import com.example.backend.entity.Staffs;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffsRepository extends JpaRepository<Staffs, Long> {

    Optional<Staffs> findByStaffName(String staffName);
    
}
