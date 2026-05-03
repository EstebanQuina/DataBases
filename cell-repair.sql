USE testdb;

CREATE TABLE Technician (
    TechnicianID VARCHAR(50) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Specialty VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Technician PRIMARY KEY (TechnicianID)
);

CREATE TABLE Customer (
    ID INTEGER NOT NULL,
    Complete_Name VARCHAR(200) NOT NULL,
    Contact_Number VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Customer PRIMARY KEY (ID)
);

CREATE TABLE Phone (
    Phone_ID INTEGER NOT NULL,
    Brand VARCHAR(50) NOT NULL,
    serial_code VARCHAR(100) NOT NULL,
    Model VARCHAR(100) NOT NULL,
    ID INTEGER NOT NULL,
    CONSTRAINT PK_Phone PRIMARY KEY (Phone_ID)
);

CREATE TABLE Repair_Order (
    Repair_Code INTEGER NOT NULL,
    Status_Phone VARCHAR(50) NOT NULL,
    Date_of_expiration VARCHAR(20) NOT NULL,
    OrderPrice VARCHAR(20) NOT NULL,
    Date_of_creation VARCHAR(20) NOT NULL,
    Issue VARCHAR(255) NOT NULL,
    Phone_ID INTEGER NOT NULL,
    TechnicianID VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Repair_Order PRIMARY KEY (Repair_Code)
);