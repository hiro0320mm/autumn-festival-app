package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record MyPageLoginRequest(

    @NotBlank(message = "お名前を入力してください")
    String applicantName,

    @NotBlank(message = "電話番号を入力してください")
    String tel,

    @NotBlank(message = "申込受付番号を入力してください")
    String receptionNumber
){}
