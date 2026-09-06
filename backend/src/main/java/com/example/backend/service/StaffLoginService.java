package com.example.backend.service;

import com.example.backend.repository.StaffsRepository;

public class StaffLoginService {

    private final StaffsRepository staffsRepository;

    public StaffLoginService(StaffsRepository staffsRepository) {
        this.staffsRepository = staffsRepository;
    }

}
