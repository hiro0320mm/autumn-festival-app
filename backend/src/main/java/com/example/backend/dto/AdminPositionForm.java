package com.example.backend.dto;

import com.example.backend.entity.Groups;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AdminPositionForm {

    // 特権管理者用にnullを受け付ける
    private Long groupId;

    @NotBlank(message = "ポジション名は必須項目です")
    private String positionName;

    @NotBlank(message = "対象者は必須項目です")
    private String target;

    @NotNull
    @Min(value = 1, message = "定員は1人以上で入力してください")
    @Max(value = 999, message = "定員は999人以下で入力してください")
    private Integer maxCapacity;

    @NotNull
    @Future(message = "締め切り日時は現在よりも未来の日時を指定してください")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @JsonFormat(pattern = "yyyy/MM/dd HH:mm", timezone = "Asia/Tokyo")
    private LocalDateTime deadline;

    private Boolean recruitmentStatus = true;

}
