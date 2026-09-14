package com.example.backend.controller;

import com.example.backend.service.MailService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


// 実装見送りのため無効化
//@RestController
@RequestMapping("/api/test-mail")
public class TestMailController {

    private final MailService mailService;

    public TestMailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping
    public String sendTestMail() {

        mailService.sendMail(
                "h.mikawa@gmail.com",
                "メール送信テスト",
                "Spring Bootからメールを送信しています。"
        );

        return "メールを送信しました";
    }
}