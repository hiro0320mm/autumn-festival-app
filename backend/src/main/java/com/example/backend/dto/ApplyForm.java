package com.example.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyForm {

    @NotBlank(message = "参加される方のお名前は必須項目です")
    private String applicantName;

    @NotBlank(message = "お名前のよみがなは必須項目です")
    @Pattern(
            regexp = "^[ぁ-んー 　]+$",
            message = "お名前のよみがなをひらがなで入力してください"
    )
    private String kana;

    @NotNull(message = "参加される方の年齢は必須項目です")
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

    @NotNull(message = "参加する山車組を選択してください")
    private Long groupId;

    @NotNull(message = "希望するポジションを選択してください")
    private Long positionId;

    private Boolean isStudent = true;

    private String schoolName;

    @Pattern(
            regexp = "^$|^[0-9]+$",
            message = "学年は半角数字で入力してください"
    )
    private String schoolGrade;

    @Pattern(
            regexp = "^$|^[0-9A-Z]+$",
            message = "クラス名は半角数字または半角大文字アルファベットで入力してください"
    )
    private String schoolClass;

    private String note;

    @NotNull(message = "個人情報の取り扱いへの同意が必要です")
    @AssertTrue(message = "個人情報の取り扱いに同意してください")
    private Boolean privacyAgreed;
}
