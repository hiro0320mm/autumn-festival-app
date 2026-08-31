package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "staffs")
public class Staffs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Long staffId;

    @NotBlank
    @Column(name = "staff_name", nullable = false)
    private String staffName;

    @NotBlank
    @Size(min = 8, max = 20, message = "パスワードの文字数を確認してください")
    @Column(name ="staff_password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    protected Staffs() {
    }

    public Staffs( String staffName, String password, Role role ) {
        this.staffName = staffName;
        this.password = password;
        this.role = role;
    }
}
