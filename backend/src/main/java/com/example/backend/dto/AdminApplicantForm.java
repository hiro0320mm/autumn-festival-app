package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminApplicantForm {

    @NotBlank(message = "参加者名は必須項目です")
    private String applicantName;

    @NotBlank(message = "よみがなは必須項目です")
    @Pattern(
            regexp = "^[ぁ-んー]+$",
            message = "お名前のよみがなをひらがなで入力してください"
    )
    private String kana;

    @NotNull(message = "年齢は必須項目です")
    private Integer age;

    @NotBlank(message = "住所は必須項目です")
    private String address;

    @NotBlank(message = "連絡先電話番号は必須項目です")
    @Pattern(
            regexp = "^\\d{10,11}$",
            message = "電話番号はハイフンなしの10桁または11桁の数字で入力してください"
    )
    private String tel;

    @NotBlank(message = "メールアドレスは必須項目です")
    @Email(message = "メールアドレスの形式が正しくありません")
    private String email;

    private String parentName;

    // 特権管理者用にnullを受け付ける
    private Long groupId;

    @NotNull(message = "ポジションを選択してください")
    private Long positionId;

    private Boolean isStudent = true;

    private String schoolName;
    private String schoolGrade;
    private String schoolClass;

    private String note;
    private String staffMemo;

}
