package com.example.backend.dto;

import jakarta.validation.constraints.*;

public record AdminApplicantUpdateRequest(

        @NotBlank(message = "参加者名は必須項目です")
        String applicantName,

        @NotBlank(message = "よみがなは必須項目です")
        String kana,

        @NotNull(message = "年齢は必須項目です")
        Integer age,

        @NotBlank(message = "住所は必須項目です")
        String address,

        @NotBlank(message = "連絡先電話番号は必須項目です")
        String tel,

        @NotBlank(message = "メールアドレスは必須項目です")
        @Email(message = "メールアドレスの形式が正しくありません")
        String email,

        String parentName,

        Long groupId,

        @NotNull(message = "ポジションを選択してください")
        Long positionId,

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
