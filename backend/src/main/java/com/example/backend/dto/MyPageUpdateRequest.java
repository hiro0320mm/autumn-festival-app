package com.example.backend.dto;

import jakarta.validation.constraints.*;

public record MyPageUpdateRequest(

    @NotBlank
    String applicantName,

    @NotBlank
    String kana,

    @NotNull
    @Min(value = 0, message = "0以上の整数を入力してください")
    @Max(value = 120, message = "年齢をご確認ください")
    Integer age,

    @NotBlank
    String address,

    @NotBlank
    @Email(message = "有効なメールアドレス形式で入力してください")
    @Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
    String email,

    @NotBlank
    String tel,

    String parentName,

    @NotNull
    Boolean isStudent,

    String schoolName,
    String schoolGrade,
    String schoolClass,

    String note
){}
