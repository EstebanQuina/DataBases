CREATE DATABASE IF NOT EXISTS university;
USE university;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    major VARCHAR(50)
);

INSERT INTO students (name, major) VALUES ('Esteban', 'Mathematics');