package com.example.backend.service;

import com.example.backend.entity.Applicants;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final AsyncMailService asyncMailService;

    public MailService(AsyncMailService asyncMailService) {
        this.asyncMailService = asyncMailService;
    }

    // 申込完了メール
    public void sendApplicationCompleteMail(Applicants applicant) {

        String text = """
            秋祭りへの参加申込を受け付けました。

            受付番号：%s
            氏名：%s
            山車組：%s
            ポジション：%s

            マイページから申込内容を確認できます。

            """.formatted(
                applicant.getReceptionNumber(),
                applicant.getApplicantName(),
                applicant.getGroup().getGroupName(),
                applicant.getPosition().getPositionName()
        );

        asyncMailService.sendMail(
                applicant.getEmail(),
                "秋祭り参加申込受付完了のお知らせ",
                text
        );
    }

    // キャンセル確定メール
    public void sendCancelCompleteMail(Applicants applicant) {

        String text = """
            秋祭り参加キャンセルのお知らせ

            以下の参加申込について、キャンセルが確定しました。

            受付番号：%s
            氏名：%s
            山車組：%s
            ポジション：%s

            """.formatted(
                applicant.getReceptionNumber(),
                applicant.getApplicantName(),
                applicant.getGroup().getGroupName(),
                applicant.getPosition().getPositionName()
        );

        asyncMailService.sendMail(
                applicant.getEmail(),
                "秋祭り参加申込キャンセルのお知らせ",
                text
        );
    }
}
