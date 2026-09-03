CREATE TABLE groups (
    group_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    district VARCHAR(255),
    description TEXT,
    office_address VARCHAR(255),
    office_tel VARCHAR(20),
    contact_name VARCHAR(255),
    contact_tel VARCHAR(20),
    created_by VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_by VARCHAR(20),
    updated_at TIMESTAMP NOT NULL
);