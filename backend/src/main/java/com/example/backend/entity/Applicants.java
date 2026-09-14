package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.security.SecureRandom;

@Setter
@Getter
@Entity
@Table(name = "applicants")
public class Applicants extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "applicant_id")
    private Long applicantId;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "group_id", nullable = false)
    private Groups group;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "position_id", nullable = false)
    private Positions position;

    @NotBlank
    @Column(name = "applicant_name")
    private String applicantName;

    @NotBlank
    @Column(name = "applicant_kana", nullable = false)
    private String kana;

    @NotNull
    @Min(value = 0, message = "0以上の整数を入力してください")
    @Max(value = 120, message = "年齢をご確認ください")
    @Column(name = "applicant_age", nullable = false)
    private Integer age;

    @NotBlank
    @Column(name = "applicant_address",nullable = false)
    private String address;

    @NotBlank
    @Email(message = "有効なメールアドレス形式で入力してください")
    @Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
    @Column(name = "applicant_email", nullable = false)
    private String email;

    @NotBlank
    @Column(name = "applicant_tel", nullable = false)
    private String tel;

    @Column(name = "parent_name")
    private String parentName;

    @NotNull
    @JsonProperty("isStudent")
    @Column(name = "is_student", nullable = false)
    private Boolean isStudent = true;

    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "school_grade")
    private String schoolGrade;

    @Column(name = "school_class")
    private String schoolClass;

    @NotNull
    @JsonProperty("cancelStatus")
    @Enumerated(EnumType.STRING)
    @Column(name = "cancel_status", nullable = false, columnDefinition = "VARCHAR(30) DEFAULT 'NONE'" )
    private CancelStatus cancelStatus = CancelStatus.NONE;

    @Column(name = "applicant_note", columnDefinition = "TEXT")
    private String note;

    @JsonIgnore
    @Column(name = "staff_memo", columnDefinition = "TEXT")
    private String staffMemo;

    @JsonProperty("receptionNumber")
    @Column(name = "reception_number", nullable = false, unique = true, length = 6, updatable = false)
    private String receptionNumber;

    //登録直前に申込受付番号を自動発行
    @PrePersist
    public void generateReceptionNumber() {
        if (this.receptionNumber == null) {
            this.receptionNumber = generateRandomCode(6);
        }
    }
    //英大文字＋数字の6桁ランダム文字列生成
    private String generateRandomCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }
        return sb.toString();
    }

}
