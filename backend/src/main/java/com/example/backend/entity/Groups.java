package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "groups")
public class Groups extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long groupId;

    @NotBlank
    @Column(name = "group_name",nullable = false)
    private String groupName;

    @Column
    private String district;

    @Column(name = "office_address")
    private String officeAddress;

    @Column(name = "office_tel")
    @Pattern(
            regexp = "^\\d{10,11}$",
            message = "電話番号はハイフンなしで入力してください。固定電話の場合は市外局番から入力してください"
    )
    private String officeTel;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_tel")
    @Pattern(
            regexp = "^\\d{10,11}$",
            message = "電話番号はハイフンなしで入力してください。固定電話の場合は市外局番から入力してください"
    )
    private String contactTel;

    @Column(columnDefinition = "TEXT")
    private String description;

}
