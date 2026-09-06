package com.example.backend.service;

import com.example.backend.repository.StaffsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffsService implements UserDetailsService {

    private final StaffsRepository staffsRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        var staff = staffsRepository.findByStaffName(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(username + " is not found"));

        return User.withUsername(staff.getStaffName())
                .password(staff.getPassword())
                .authorities(staff.getRole().name())
                .build();
    }

}
