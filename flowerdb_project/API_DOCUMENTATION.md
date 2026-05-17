Flower Production Company - API Documentation
This document outlines the RESTful API endpoints, request methods, and expected JSON data formats for the Flower Production Enterprise Database.

Base URL
http://127.0.0.1:5000

Standard HTTP Status Codes
200 OK: Request succeeded (used for GET, PUT, and DELETE operations).

201 Created: New record successfully created (used for POST operations).

400 Bad Request: Failed operation, usually due to missing data, type mismatch, or database constraint violations (e.g., Foreign Key failure).

404 Not Found: The requested resource or Primary Key does not exist.

1. Master Data & Configuration
Companies

GET /companies - Retrieve all companies.

POST /companies - Create a new company.

Payload: {"RUC": 1234567892, "Name": "String", "Phone": "String", "Address": "String"}

PUT /companies/<int:RUC> - Update company details.

DELETE /companies/<int:RUC> - Delete a company.

Cities

GET /cities - Retrieve all cities.

POST /cities - Register a new city.

Payload: {"City_name": "String", "Country": "String"}

PUT /cities/<string:City_name> - Update city country.

DELETE /cities/<string:City_name> - Delete a city.

Departments

GET /departments - Retrieve all departments.

POST /departments - Create a new department.

Payload: {"Department_name": "String", "RUC": Integer}

PUT /departments/<string:Department_name> - Update department's company assignment.

DELETE /departments/<string:Department_name> - Delete a department.

Products (Flower Varieties)

GET /products - Retrieve all flower varieties.

POST /products - Add a new flower variety.

Payload: {"Product_id": "String", "Variety_name": "String", "Color": "String"}

PUT /products/<string:Product_id> - Update variety details.

DELETE /products/<string:Product_id> - Delete a variety.

Lots (Greenhouse Zones)

GET /lots - Retrieve all active lots.

POST /lots - Create a new lot (Auto-increments Lot_number, no payload required).

DELETE /lots/<int:Lot_number> - Delete a lot.

2. Human Resources
Employees

GET /employees - Retrieve all employees.

POST /employees - Register a new employee (Employee_id is auto-generated).

Payload: {"Department_name": "String", "Hiring_date": "YYYY-MM-DD", "Name": "String", "Last_name": "String", "Birth_date": "YYYY-MM-DD", "Role": "String", "Sex": "M|F"}

PUT /employees/<int:Employee_id> - Update employee details.

DELETE /employees/<int:Employee_id> - Delete an employee.

3. Production & Post-Harvest
Daily Production (Greenhouse Harvest)

GET /daily-production - Retrieve all daily harvest logs.

POST /daily-production - Log new harvested quantities.

Payload: {"Date": "YYYY-MM-DD", "Product_id": "String", "Lot_number": Integer, "Quantity": Integer}

PUT /daily-production/<string:Date>/<string:Product_id>/<int:Lot_number> - Update harvest quantity (Requires 3-part composite key).

DELETE /daily-production/<string:Date>/<string:Product_id>/<int:Lot_number> - Delete harvest log.

Daily Post-Harvest (Finished Goods Processing)

GET /daily-post-harvest - Retrieve all processed flower logs.

POST /daily-post-harvest - Log newly graded and processed stems.

Payload: {"Date": "YYYY-MM-DD", "Length": Float, "Employee_id": Integer, "Product_id": "String", "Quantity": Integer}

PUT /daily-post-harvest/<string:Date>/<float:Length>/<int:Employee_id>/<string:Product_id> - Update processed quantity (Requires 4-part composite key).

DELETE /daily-post-harvest/<string:Date>/<float:Length>/<int:Employee_id>/<string:Product_id> - Delete a processing log.

Agrochemical Products

GET /agrochemical-products - Retrieve chemical inventory.

POST /agrochemical-products - Add new chemical.

Payload: {"Ag_Product_id": "String", "Name": "String", "Description": "String"}

PUT /agrochemical-products/<string:Ag_Product_id> - Update chemical details.

DELETE /agrochemical-products/<string:Ag_Product_id> - Delete a chemical.

Fumigation Events

GET /fumigation-events - Retrieve all fumigation logs.

POST /fumigation-events - Log a new field treatment (Fumigation_id is auto-generated).

Payload: {"Date": "YYYY-MM-DD", "Lot_number": Integer, "Ag_Product_id": "String", "Target_pest": "String", "Dosage": Float, "Volume": Float, "Application_method": "String"}

PUT /fumigation-events/<int:Fumigation_id> - Update fumigation details.

DELETE /fumigation-events/<int:Fumigation_id> - Delete a fumigation event.

4. Sales & Orders
Customers (Client Directory)

GET /customers - Retrieve all clients.

POST /customers - Register a new client (Customer_id is auto-generated).

Payload: {"Name": "String", "City_name": "String", "Phone": "String", "Email": "String"}

PUT /customers/<int:Customer_id> - Update client details.

DELETE /customers/<int:Customer_id> - Delete a client.

Orders

GET /orders - Retrieve all active orders.

POST /orders - Create a new order.

Payload: {"Order_id": "String", "Date": "YYYY-MM-DD", "Customer_id": Integer, "Dispatch_date": "YYYY-MM-DD", "Description": "String"}

PUT /orders/<string:Order_id> - Update order details.

DELETE /orders/<string:Order_id> - Delete an order.

Order Line Items

GET /order-line-items - Retrieve specific items mapped to orders.

POST /order-line-items - Add items to an order.

Payload: {"Order_id": "String", "Product_id": "String", "Required_length": Float, "Negotiated_price": Float, "Quantity": Integer}

PUT /order-line-items/<string:Order_id>/<string:Product_id> - Update line item quantity or price.

DELETE /order-line-items/<string:Order_id>/<string:Product_id> - Remove a product from an order.

5. System Utilities
Seed Database

GET /seed-all - Initializes all database tables and populates them with sample master data to satisfy foreign key dependencies.

Response: {"message": "Master seed complete! All 17 tables populated successfully."}