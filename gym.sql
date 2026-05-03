DROP DATABASE IF EXISTS gym;
CREATE DATABASE gym;
USE gym;

CREATE TABLE Trainers (
    Trainer_id INTEGER NOT NULL,
    Name VARCHAR(20) NOT NULL,
    Age INTEGER NOT NULL,
    Years_of_experience INTEGER NOT NULL,
    CONSTRAINT Trainer_id_pk PRIMARY KEY (Trainer_id)
);

CREATE TABLE Classes (
    Class_id VARCHAR(10) NOT NULL,
    Trainers_Trainer_id INTEGER NOT NULL,
    Name VARCHAR(20) NOT NULL,
    Trainer_id VARCHAR(10) NOT NULL,
    Shedule VARCHAR(100) NOT NULL,
    WP_id VARCHAR(10) NOT NULL,
    CONSTRAINT Class_id_pk PRIMARY KEY (Class_id)
);

CREATE TABLE Workout_plans (
    WP_id VARCHAR(10) NOT NULL,
    Trainer_id INTEGER NOT NULL,
    Name VARCHAR(10) NOT NULL,
    Purpose VARCHAR(50) NOT NULL,
    CONSTRAINT Workout_plans_pk PRIMARY KEY (WP_id)
);

CREATE TABLE Gym (
    RUC INTEGER NOT NULL,
    Name VARCHAR(10) NOT NULL,
    Adress VARCHAR(50) NOT NULL,
    Phone INTEGER NOT NULL,
    CONSTRAINT gym_pk PRIMARY KEY (RUC)
);

CREATE TABLE Members (
    Member_id INTEGER NOT NULL,
    RUC INTEGER NOT NULL,
    Trainer_id INTEGER NOT NULL,
    WP_id VARCHAR(10) NOT NULL,
    Name VARCHAR(10) NOT NULL,
    Phone INTEGER NOT NULL,
    Age INTEGER NOT NULL,
    Enrollment_date DATE NOT NULL,
    CONSTRAINT Member_id_pk PRIMARY KEY (Member_id)
);

CREATE TABLE Attendance (
    Members_Member_id INTEGER NOT NULL,
    Member_id VARCHAR(10) NOT NULL,
    Date DATE NOT NULL,
    Class_id VARCHAR(10) NOT NULL,
    CONSTRAINT Attendance_id_pk PRIMARY KEY (Members_Member_id, Member_id, Date, Class_id)
);

ALTER TABLE Members ADD CONSTRAINT Trainers_Members_fk
FOREIGN KEY (Trainer_id) REFERENCES Trainers (Trainer_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Workout_plans ADD CONSTRAINT Trainers_Workout_plans_fk
FOREIGN KEY (Trainer_id) REFERENCES Trainers (Trainer_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Classes ADD CONSTRAINT Trainers_Classes_fk
FOREIGN KEY (Trainers_Trainer_id) REFERENCES Trainers (Trainer_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Attendance ADD CONSTRAINT Classes_Attendance_fk
FOREIGN KEY (Class_id) REFERENCES Classes (Class_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Members ADD CONSTRAINT Workout_plans_Members_fk
FOREIGN KEY (WP_id) REFERENCES Workout_plans (WP_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Members ADD CONSTRAINT Gym_Members_fk
FOREIGN KEY (RUC) REFERENCES Gym (RUC)
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Attendance ADD CONSTRAINT Members_Attendance_fk
FOREIGN KEY (Members_Member_id) REFERENCES Members (Member_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;
