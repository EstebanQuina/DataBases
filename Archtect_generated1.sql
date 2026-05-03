
CREATE TABLE Courses (
                Course_id VARCHAR(10) NOT NULL,
                Course_name VARCHAR(10) NOT NULL,
                CONSTRAINT Course_id_pk PRIMARY KEY (Course_id)
);


CREATE TABLE Student (
                Student_id VARCHAR(10) NOT NULL,
                Name VARCHAR(10) NOT NULL,
                CONSTRAINT Student_id_pk PRIMARY KEY (Student_id)
);


CREATE TABLE Enrollments (
                Student_id VARCHAR(10) NOT NULL,
                Course_id VARCHAR(10) NOT NULL,
                Academic_period VARCHAR(10) NOT NULL,
                Status VARCHAR(10) NOT NULL,
                CONSTRAINT Enrollments_id_pk PRIMARY KEY (Student_id, Course_id)
);


ALTER TABLE Enrollments ADD CONSTRAINT Courses_Enrollments_fk
FOREIGN KEY (Course_id)
REFERENCES Courses (Course_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Enrollments ADD CONSTRAINT Student_Enrollments_fk
FOREIGN KEY (Student_id)
REFERENCES Student (Student_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;