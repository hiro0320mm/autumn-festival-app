package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record AdminPositionUpdateRequest(
        // 特権管理者用にnullを受け付ける
        Long groupId,

        @NotBlank(message = "ポジション名は必須項目です")
        String positionName,

        @NotBlank(message = "対象者は必須項目です")
        String target,

        @NotNull(message = "定員は必須項目です")
        @Min(value = 1, message = "定員は1人以上で入力してください")
        @Max(value = 999, message = "定員は999人以下で入力してください")
        Integer maxCapacity,

        @NotNull(message = "締め切り日時は必須項目です")
        @Future(message = "締め切り日時は現在よりも未来の日時を指定してください")
        @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        @JsonFormat(pattern = "yyyy/MM/dd HH:mm", timezone = "Asia/Tokyo")
        LocalDateTime deadline,

        Boolean recruitmentStatus

) {
    public AdminPositionUpdateRequest{
        if (recruitmentStatus == null) {
            recruitmentStatus = true;
        }
    }

}
