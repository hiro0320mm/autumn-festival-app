INSERT INTO staffs (
                    group_id,
                    staff_name,
                    staff_password,
                    role,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
) VALUES
(NULL, 'システム管理者', '$2a$12$Q5mjKDSMmQNP4SLbalz45OYXa4OOCo5lxXJFKA8fhhBqejtvNUz22','ROLE_ADMIN','SYSTEM',CURRENT_TIMESTAMP,'SYSTEM',CURRENT_TIMESTAMP),
(1, '上組担当者', '$2a$12$/WXoDvuOYoj/pyL7ga8mCe6vrkg54b.0IsP0Ub6IYAExFcsKDsq5K','ROLE_USER','SYSTEM',CURRENT_TIMESTAMP,'SYSTEM',CURRENT_TIMESTAMP),
(2, '中組担当者', '$2a$12$P4JsevOxnfPyd2pCgOJXROmkHsRuBW/uf8G/C/5BrT6ZbV8R6ltaO','ROLE_USER','SYSTEM',CURRENT_TIMESTAMP,'SYSTEM',CURRENT_TIMESTAMP),
(3, 'に組担当者', '$2a$12$QBZe3pgtgGgxhQabxNq6LO2QBKWqRnUQyo2df6GgOw8T/mxD.kjg6','ROLE_USER','SYSTEM',CURRENT_TIMESTAMP,'SYSTEM',CURRENT_TIMESTAMP),
(4, '巽町組担当者', '$2a$12$M./UEeE3MUriz6foRHOHau9WHfrM4iPcgWD/7MS6NUV62b0HB64nu','ROLE_USER','SYSTEM',CURRENT_TIMESTAMP,'SYSTEM',CURRENT_TIMESTAMP);
