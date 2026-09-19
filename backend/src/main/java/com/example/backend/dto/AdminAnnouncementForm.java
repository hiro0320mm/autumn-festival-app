package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminAnnouncementForm {

    @NotBlank(message = "お知らせのタイトルを入力してください")
    private String title;

    @NotBlank(message = "お知らせの内容を入力してください")
    private String content;

    private Boolean isPublished = true;
}
