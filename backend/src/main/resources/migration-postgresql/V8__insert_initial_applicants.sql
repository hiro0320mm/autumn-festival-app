INSERT INTO applicants (
                        group_id,
                        position_id,
                        applicant_name,
                        applicant_kana,
                        applicant_age,
                        applicant_address,
                        applicant_email,
                        applicant_tel,
                        parent_name,
                        is_student,
                        school_name,
                        school_grade,
                        school_class,
                        cancel_status,
                        applicant_note,
                        application_number,
                        created_by,
                        created_at,
                        updated_by,
                        updated_at
) VALUES
(1,2,'山田花子', 'やまだはなこ',10,'岩手県○○市××町△丁目XX-XX ■■■マンションXXX','yamada@example.com', '09012345678', '山田太郎', TRUE, '○○小学校', '5','2','NONE','前夜祭は送り迎えができないため不参加とさせてください','8TY02B','SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP);