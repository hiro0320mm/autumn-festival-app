package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "announcements")
public class Announcements extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "announcement_id")
    private Long announcementId;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Groups group;

    @NotBlank
    @Column(name = "title")
    private String title;

    @NotBlank
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @NotNull
    @JsonProperty("isPublished")
    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = true;
}
