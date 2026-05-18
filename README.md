# Yachay Floral ERP - Database System

A full-stack Enterprise Resource Planning (ERP) database system tailored for a commercial flower production enterprise. This project digitizes and integrates complex agricultural workflows, including master data management, greenhouse harvesting, post-harvest quality control, human resources, and international sales.

The architecture is built on a strictly normalized (3NF) **MySQL** relational database, exposed via a **Python Flask REST API**, and consumed by a modern, responsive **React.js** Single Page Application (SPA).

## 🏗️ System Architecture

* **Database Layer:** MySQL (17 interconnected tables in 3rd Normal Form)
* **Backend API:** Python 3, Flask, Flask-SQLAlchemy, Marshmallow
* **Frontend UI:** React.js, Vite, Tailwind CSS, Recharts (for analytics)

## ✨ Key Features

* **Constraint-Driven UI:** Frontend forms dynamically fetch relational master data to populate dropdowns, mathematically preventing foreign-key constraint violations.
* **Composite Key Protection:** "Dual-Purpose Modals" allow seamless CRUD operations while programmatically locking primary and composite keys during updates (`PUT` requests) to preserve referential integrity.
* **Real-Time Analytics:** Aggregates thousands of daily operational logs into actionable business intelligence, featuring dynamic inventory calculations and historical stacked-area yield charts.
* **Robust Transaction Safety:** SQLAlchemy manages database sessions with built-in rollback mechanisms to prevent partial data writes during complex operational logging.

## 📂 Repository Structure

The repository is divided into two main directories:

```text
DataBases/
├── flowerdb_project/    # Backend Flask API & Database scripts
│   ├── app.py           
│   ├── final_project3.py # Main API routing and ORM models
│   ├── schema.sql       # MySQL DDL script
│   ├── requirements.txt # Python dependencies
│   └── API_DOCUMENTATION.md # Detailed REST endpoint documentation
└── flower-frontend/     # Frontend React Application
    ├── src/             # React components and views
    ├── package.json     # Node dependencies
    └── vite.config.js   # Vite configuration