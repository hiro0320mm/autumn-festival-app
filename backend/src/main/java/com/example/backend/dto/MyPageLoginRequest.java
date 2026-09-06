package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MyPageLoginRequest {

    @NotBlank(message = "お名前を入力してください")
    private String applicantName;

    @NotBlank(message = "電話番号を入力してください")
    private String tel;

    @NotBlank(message = "申込受付番号を入力してください")
    private String receptionNumber;
}
