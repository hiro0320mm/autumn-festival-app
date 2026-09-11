package com.example.backend.dto;

import jakarta.validation.constraints.*;

public record MyPageUpdateRequest(

    @NotBlank(message = "参加される方のお名前を入力してください")
    String applicantName,

    @NotBlank
    @Pattern(
            regexp = "^[ぁ-んー]+$",
            message = "お名前のよみがなをひらがなで入力してください"
    )
    String kana,

    @NotNull(message = "年齢を入力してください")
    @Min(value = 0, message = "0以上の整数を入力してください")
    @Max(value = 120, message = "年齢をご確認ください")
    Integer age,

    @NotBlank(message = "住所を入力してください")
    String address,

    @NotBlank(message = "メールアドレスを入力してください")
    @Email(message = "有効なメールアドレス形式で入力してください")
    @Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
    String email,

    @NotBlank(message = "連絡先電話番号を入力してください")
    @Pattern(
            regexp = "^\\d{10,11}$",
            message = "電話番号はハイフンなしの10桁または11桁の数字で入力してください"
    )
    String tel,

    String parentName,

    @NotNull
    Boolean isStudent,

    String schoolName,
    String schoolGrade,
    String schoolClass,

    String note
){}
