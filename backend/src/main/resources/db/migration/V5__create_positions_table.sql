CREATE TABLE POSITIONS (
    position_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT NOT NULL,
    position_name VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    max_capacity INT NOT NULL CHECK(max_capacity BETWEEN 1 AND 999),
    recruitment_deadline TIMESTAMP NOT NULL,
    recruitment_status BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(20),
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_positions_group
                    FOREIGN KEY (group_id)
                    REFERENCES GROUPS(group_id)
                    ON DELETE CASCADE
);