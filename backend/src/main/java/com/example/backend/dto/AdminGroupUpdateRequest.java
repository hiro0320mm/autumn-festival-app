package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AdminGroupUpdateRequest(

        String district,

        String officeAddress,

        @Pattern(
                regexp = "^\\d{10,11}$",
                message = "電話番号はハイフンなしで入力してください。固定電話の場合は市外局番から入力してください"
        )
        String officeTel,

        String contactName,

        @Pattern(
                regexp = "^\\d{10,11}$",
                message = "電話番号はハイフンなしで入力してください。固定電話の場合は市外局番から入力してください")
        String contactTel,

        String description

) {
}
