package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "positions")
public class Positions extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "position_id")
    private Long positionId;

    @NotBlank
    @Column(name = "position_name",nullable = false)
    private String positionName;

    @NotBlank
    @Column(nullable = false)
    private String target;

    @NotBlank
    @Min(value = 1, message = "人数は1人以上で入力してください")
    @Max(value = 999, message = "人数は999人以下で入力してください")
    @Column(name ="max_capacity", nullable = false)
    private Integer maxCapacity;

    @NotBlank
    @Future(message = "締め切り日時は現在よりも未来の日時を指定してください")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @JsonFormat(pattern = "yyyy/MM/dd HH:mm", timezone = "Asia/Tokyo")
    @Column(name = "recruitment_deadline", nullable = false)
    private LocalDateTime deadline;

}
