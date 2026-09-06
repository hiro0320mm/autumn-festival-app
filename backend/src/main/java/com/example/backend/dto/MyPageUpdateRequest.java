package com.example.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MyPageUpdateRequest {

    @NotBlank
    private String applicantName;

    @NotBlank
    private String kana;

    @NotNull
    @Min(value = 0, message = "0以上の整数を入力してください")
    @Max(value = 120, message = "年齢をご確認ください")
    private Integer age;

    @NotBlank
    private String address;

    @NotBlank
    @Email(message = "有効なメールアドレス形式で入力してください")
    @Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
    private String email;

    @NotBlank
    private String tel;

    private String parentName;

    @NotNull
    private Boolean isStudent;

    private String schoolName;
    private String schoolGrade;
    private String schoolClass;

    private String note;
}
