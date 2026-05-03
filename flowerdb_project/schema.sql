-- ============================================================
-- Database Schema: Commercial Flower Production Enterprise
-- Authors: Esteban Quiña & Marcial Valero
-- Institution: Yachay Tech University
-- Normal Form: Third Normal Form (3NF)
-- DBMS: MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS flower_production;
USE flower_production;

-- ------------------------------------------------------------
-- 1. COMPANY & ORGANIZATION
-- ------------------------------------------------------------

CREATE TABLE Company (
    RUC         INTEGER         NOT NULL,
    Name        VARCHAR(50)     NOT NULL,
    Phone       VARCHAR(20)     NOT NULL,
    Address     VARCHAR(100)    NOT NULL,
    CONSTRAINT PK_Company PRIMARY KEY (RUC)
);

CREATE TABLE Departments (
    Department_name VARCHAR(30) NOT NULL,
    RUC             INTEGER     NOT NULL,
    CONSTRAINT PK_Departments PRIMARY KEY (Department_name),
    CONSTRAINT FK_Dept_Company FOREIGN KEY (RUC) REFERENCES Company(RUC)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- 2. HUMAN RESOURCES
-- ------------------------------------------------------------

CREATE TABLE Employees (
    Employee_id     INTEGER         NOT NULL AUTO_INCREMENT,
    Department_name VARCHAR(30)     NOT NULL,
    Hiring_date     DATE            NOT NULL,
    Name            VARCHAR(30)     NOT NULL,
    Last_name       VARCHAR(30)     NOT NULL,
    Birth_date      DATE            NOT NULL,
    Role            VARCHAR(30)     NOT NULL,
    Sex             CHAR(1)         NOT NULL,   -- 'M' or 'F'
    CONSTRAINT PK_Employees PRIMARY KEY (Employee_id),
    CONSTRAINT FK_Emp_Dept FOREIGN KEY (Department_name)
        REFERENCES Departments(Department_name)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_Sex CHECK (Sex IN ('M', 'F'))
);

-- ------------------------------------------------------------
-- 3. EQUIPMENT
-- ------------------------------------------------------------

CREATE TABLE Machine_stock (
    Equip_id    VARCHAR(10) NOT NULL,
    Buy_date    DATE        NOT NULL,
    CONSTRAINT PK_Machine PRIMARY KEY (Equip_id)
);

-- ------------------------------------------------------------
-- 4. PRODUCTION
-- ------------------------------------------------------------

CREATE TABLE Lots (
    Lot_number  INTEGER NOT NULL AUTO_INCREMENT,
    CONSTRAINT PK_Lots PRIMARY KEY (Lot_number)
);

CREATE TABLE Products (
    Product_id      VARCHAR(10) NOT NULL,
    Variety_name    VARCHAR(30) NOT NULL,
    Color           VARCHAR(20) NOT NULL,
    CONSTRAINT PK_Products PRIMARY KEY (Product_id)
);

CREATE TABLE Daily_production (
    Date        DATE        NOT NULL,
    Product_id  VARCHAR(10) NOT NULL,
    Lot_number  INTEGER     NOT NULL,
    Quantity    INTEGER     NOT NULL,
    CONSTRAINT PK_DailyProd PRIMARY KEY (Date, Product_id, Lot_number),
    CONSTRAINT FK_DP_Product FOREIGN KEY (Product_id)
        REFERENCES Products(Product_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_DP_Lot FOREIGN KEY (Lot_number)
        REFERENCES Lots(Lot_number)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_DP_Qty CHECK (Quantity > 0)
);

CREATE TABLE Employee_production (
    Employee_id INTEGER     NOT NULL,
    Product_id  VARCHAR(10) NOT NULL,
    Date        DATE        NOT NULL,
    Lot_number  INTEGER     NOT NULL,
    CONSTRAINT PK_EmpProd PRIMARY KEY (Employee_id, Product_id, Date, Lot_number),
    CONSTRAINT FK_EP_Emp FOREIGN KEY (Employee_id)
        REFERENCES Employees(Employee_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_EP_DP FOREIGN KEY (Date, Product_id, Lot_number)
        REFERENCES Daily_production(Date, Product_id, Lot_number)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. AGROCHEMICALS & FUMIGATION MODULE (3NF Corrected)
-- ------------------------------------------------------------

CREATE TABLE Agrochemical_products (
    Ag_Product_id   VARCHAR(20)     NOT NULL,
    Name            VARCHAR(30)     NOT NULL,
    Description     VARCHAR(100)    NOT NULL,
    CONSTRAINT PK_AgroProducts PRIMARY KEY (Ag_Product_id)
);

CREATE TABLE Fumigation_events (
    Fumigation_id       INTEGER         NOT NULL AUTO_INCREMENT,
    Date                DATE            NOT NULL,
    Lot_number          INTEGER         NOT NULL,
    Ag_Product_id       VARCHAR(20)     NOT NULL,
    Target_pest         VARCHAR(50)     NOT NULL,
    Dosage              FLOAT           NOT NULL,
    Volume              FLOAT           NOT NULL,
    Application_method  VARCHAR(50)     NOT NULL,
    CONSTRAINT PK_FumEvent PRIMARY KEY (Fumigation_id),
    CONSTRAINT FK_FE_Lot FOREIGN KEY (Lot_number)
        REFERENCES Lots(Lot_number)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_FE_AgroProd FOREIGN KEY (Ag_Product_id)
        REFERENCES Agrochemical_products(Ag_Product_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_FE_Dosage CHECK (Dosage > 0),
    CONSTRAINT CHK_FE_Volume CHECK (Volume > 0)
);

CREATE TABLE Employee_fumigation (
    Employee_id     INTEGER NOT NULL,
    Fumigation_id   INTEGER NOT NULL,
    CONSTRAINT PK_EmpFum PRIMARY KEY (Employee_id, Fumigation_id),
    CONSTRAINT FK_EF_Emp FOREIGN KEY (Employee_id)
        REFERENCES Employees(Employee_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_EF_FumEvent FOREIGN KEY (Fumigation_id)
        REFERENCES Fumigation_events(Fumigation_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Machine_fumigation (
    Equip_id        VARCHAR(10) NOT NULL,
    Fumigation_id   INTEGER     NOT NULL,
    CONSTRAINT PK_MachFum PRIMARY KEY (Equip_id, Fumigation_id),
    CONSTRAINT FK_MF_Machine FOREIGN KEY (Equip_id)
        REFERENCES Machine_stock(Equip_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_MF_FumEvent FOREIGN KEY (Fumigation_id)
        REFERENCES Fumigation_events(Fumigation_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 6. POST-HARVEST
-- ------------------------------------------------------------

CREATE TABLE Daily_post_harvest (
    Date        DATE        NOT NULL,
    Length      FLOAT       NOT NULL,   -- Standard: 40, 45, 50, 55 cm
    Employee_id INTEGER     NOT NULL,
    Product_id  VARCHAR(10) NOT NULL,
    Quantity    INTEGER     NOT NULL,
    CONSTRAINT PK_PostHarvest PRIMARY KEY (Date, Length, Employee_id, Product_id),
    CONSTRAINT FK_PH_Emp FOREIGN KEY (Employee_id)
        REFERENCES Employees(Employee_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_PH_Product FOREIGN KEY (Product_id)
        REFERENCES Products(Product_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_PH_Length CHECK (Length IN (40, 45, 50, 55)),
    CONSTRAINT CHK_PH_Qty CHECK (Quantity > 0)
);

-- ------------------------------------------------------------
-- 7. SALES & ORDERS MODULE (3NF Corrected)
-- ------------------------------------------------------------

CREATE TABLE Cities (
    City_name   VARCHAR(30) NOT NULL,
    Country     VARCHAR(30) NOT NULL,
    CONSTRAINT PK_Cities PRIMARY KEY (City_name)
);

CREATE TABLE Customers (
    Customer_id INTEGER     NOT NULL AUTO_INCREMENT,
    Name        VARCHAR(50) NOT NULL,
    City_name   VARCHAR(30) NOT NULL,
    Phone       VARCHAR(20) NOT NULL,
    Email       VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Customers PRIMARY KEY (Customer_id),
    CONSTRAINT FK_Cust_City FOREIGN KEY (City_name)
        REFERENCES Cities(City_name)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT UQ_Cust_Email UNIQUE (Email)
);

CREATE TABLE Orders (
    Order_id        VARCHAR(10)     NOT NULL,
    Date            DATE            NOT NULL,
    Customer_id     INTEGER         NOT NULL,
    Dispatch_date   DATE            NOT NULL,
    Description     VARCHAR(100)    NOT NULL,
    CONSTRAINT PK_Orders PRIMARY KEY (Order_id),
    CONSTRAINT FK_Ord_Cust FOREIGN KEY (Customer_id)
        REFERENCES Customers(Customer_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Order_line_items (
    Order_id            VARCHAR(10) NOT NULL,
    Product_id          VARCHAR(10) NOT NULL,
    Required_length     FLOAT       NOT NULL,
    Negotiated_price    FLOAT       NOT NULL,
    Quantity            INTEGER     NOT NULL,
    CONSTRAINT PK_OrderLineItems PRIMARY KEY (Order_id, Product_id),
    CONSTRAINT FK_OLI_Order FOREIGN KEY (Order_id)
        REFERENCES Orders(Order_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_OLI_Product FOREIGN KEY (Product_id)
        REFERENCES Products(Product_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_OLI_Length CHECK (Required_length IN (40, 45, 50, 55)),
    CONSTRAINT CHK_OLI_Price CHECK (Negotiated_price > 0),
    CONSTRAINT CHK_OLI_Qty CHECK (Quantity > 0)
);
