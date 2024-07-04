CREATE TABLE student
(
    id VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);