package com.example.backend.dto;

import jakarta.validation.constraints.*;

public record AdminApplicantUpdateRequest(

        // 特権管理者用
        Long groupId,

        @NotBlank(message = "参加者名は必須項目です")
        String applicantName,

        @NotBlank(message = "よみがなは必須項目です")
        @Pattern(
                regexp = "^[ぁ-んー 　]+$",
                message = "お名前のよみがなをひらがなで入力してください"
        )
        String kana,

        @NotNull(message = "年齢は必須項目です")
        Integer age,

        @NotBlank(message = "住所は必須項目です")
        String address,

        @NotBlank(message = "連絡先電話番号は必須項目です")
        @Pattern(
                regexp = "^\\d{10,11}$",
                message = "電話番号はハイフンなしの10桁または11桁の数字で入力してください"
        )
        String tel,

        @NotBlank(message = "メールアドレスは必須項目です")
        @Email(message = "メールアドレスの形式が正しくありません")
        String email,

        String parentName,

        Boolean isStudent,

        String schoolName,
        String schoolGrade,
        String schoolClass,

        String note,
        String staffMemo

) {
    public AdminApplicantUpdateRequest{
        if (isStudent == null) {
            isStudent = true;
        }
    }
}
