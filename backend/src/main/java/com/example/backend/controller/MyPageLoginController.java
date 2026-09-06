package com.example.backend.controller;

import com.example.backend.dto.MyPageLoginRequest;
import com.example.backend.dto.MyPageLoginResponse;
import com.example.backend.entity.Applicants;
import com.example.backend.service.MyPageLoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/mypage")
public class MyPageLoginController {

    private final MyPageLoginService myPageLoginService;
    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    public MyPageLoginController(MyPageLoginService myPageLoginService) {
        this.myPageLoginService = myPageLoginService;
    }

    @PostMapping("/login")
    public ResponseEntity<MyPageLoginResponse> login(
            @Valid @RequestBody MyPageLoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {

        Applicants applicant = myPageLoginService.login(request);

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        applicant.getApplicantId(),
                        null,
                        Collections.emptyList()
                );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(
                context,
                httpRequest,
                httpResponse
        );

        return ResponseEntity.ok(MyPageLoginResponse.from(applicant));

    }
}
