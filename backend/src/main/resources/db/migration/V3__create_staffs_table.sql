CREATE TABLE staffs (
    staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT,
    staff_password VARCHAR(255) NOT NULL,
    staff_name VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_by VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(20),
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_staffs_group
                    FOREIGN KEY (group_id)
                    REFERENCES groups(group_id)
                    ON DELETE CASCADE
);