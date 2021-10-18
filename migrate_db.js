const pool = require('./db/pool');

pool.query(`CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(50) NOT NULL,
	sub VARCHAR(200),
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_deleted BOOLEAN DEFAULT false
);`);

pool.query(`CREATE TABLE todo_list (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    todo_date DATE, 
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_deleted BOOLEAN DEFAULT false,
    CONSTRAINT fk_owner_id
        FOREIGN KEY(owner_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);`);

pool.query(`CREATE TABLE todo (
    id BIGSERIAL PRIMARY KEY,
    list_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    todo VARCHAR(1000) NOT NULL,
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_deleted BOOLEAN DEFAULT false,
    CONSTRAINT fk_list_id
        FOREIGN KEY(list_id)
            REFERENCES todo_list(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_author_id
        FOREIGN KEY(author_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);`);

pool.query(`CREATE TABLE todolist_user_mapping (
    user_id BIGINT NOT NULL,
    todo_list_id BIGINT NOT NULL,
    added_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(user_id, todo_list_id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_todo_list
        FOREIGN KEY(todo_list_id)
            REFERENCES todo_list(id)
            ON DELETE CASCADE
);`);
