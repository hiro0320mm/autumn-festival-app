package com.example.backend.validator;

import org.springframework.stereotype.Component;

@Component
public class ApplicationValidator {
    public void validate(
            Integer age,
            String parentName,
            Boolean isStudent,
            String schoolName,
            String schoolGrade,
            String schoolClass
    ) {

        // 18歳未満は保護者名の入力を必須にする
        if (age != null && age < 18) {
            if (parentName == null || parentName.isBlank()) {
                throw new IllegalArgumentException(
                        "参加者が18歳未満の場合は保護者名を必ずご入力ください"
                );
            }
        }

        // 小中高校生は学校情報の入力を必須にする
        if (Boolean.TRUE.equals(isStudent)) {
            if (isNullOrBlank(schoolName) ||
                    isNullOrBlank(schoolGrade) ||
                    isNullOrBlank(schoolClass)) {

                throw new IllegalArgumentException(
                        "小中高生は学校名・学年・クラスを必ずご入力ください"
                );
            }
        }

    }

    private boolean isNullOrBlank(String str) {
        return str == null || str.isBlank();
    }
}
