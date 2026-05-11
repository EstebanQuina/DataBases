from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from datetime import date
from flask_marshmallow.sqla import SQLAlchemyAutoSchema
from marshmallow import fields
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# ── Configuration ──────────────────────────────────────────────────────────────
# Switch URI to your MySQL container:
# mysql+pymysql://root:YOUR_PASSWORD@127.0.0.1:3306/flower_production
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:1943-me@localhost:3306/flower_production"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ══════════════════════════════════════════════════════════════════════════════
# MODELS
# ══════════════════════════════════════════════════════════════════════════════

class Company(db.Model):
    __tablename__ = "Company"
    RUC     = db.Column(db.Integer, primary_key=True)
    Name    = db.Column(db.String(50),  nullable=False)
    Phone   = db.Column(db.String(20),  nullable=False)
    Address = db.Column(db.String(100), nullable=False)


class CompanySchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Company
        sqla_session = db.session

    RUC = fields.Integer(required=True)
    Name = fields.String(required=True)
    Phone = fields.String(required=True)
    Address = fields.String(required=True)


class Department(db.Model):
    __tablename__ = "Departments"
    Department_name = db.Column(db.String(30), primary_key=True)
    RUC             = db.Column(db.Integer, db.ForeignKey("Company.RUC"), nullable=False)



class DepartmentSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Department
        sqla_session = db.session

    Department_name = fields.String(required=True)
    RUC = fields.Integer(required=True)


class Employee(db.Model):
    __tablename__ = "Employees"
    Employee_id     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Department_name = db.Column(db.String(30), db.ForeignKey("Departments.Department_name"), nullable=False)
    Hiring_date     = db.Column(db.Date,    nullable=False)
    Name            = db.Column(db.String(30), nullable=False)
    Last_name       = db.Column(db.String(30), nullable=False)
    Birth_date      = db.Column(db.Date,    nullable=False)
    Role            = db.Column(db.String(30), nullable=False)
    Sex             = db.Column(db.String(1),  nullable=False)



class EmployeeSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Employee
        sqla_session = db.session

    Employee_id = fields.Integer(dump_only=True)
    Department_name = fields.String(required=True)
    Hiring_date = fields.Date(required=True)
    Name = fields.String(required=True)
    Last_name = fields.String(required=True)
    Birth_date = fields.Date(required=True)
    Role = fields.String(required=True)
    Sex = fields.String(required=True)



class MachineStock(db.Model):
    __tablename__ = "Machine_stock"
    Equip_id  = db.Column(db.String(10), primary_key=True)
    Buy_date  = db.Column(db.Date, nullable=False)


class MachineStockSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = MachineStock
        sqla_session = db.session

    Equip_id = fields.String(required=True)
    Buy_date = fields.Date(required=True)


class Lot(db.Model):
    __tablename__ = "Lots"
    Lot_number = db.Column(db.Integer, primary_key=True, autoincrement=True)


class LotSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Lot
        sqla_session = db.session

    Lot_number = fields.Integer(dump_only=True)


class Product(db.Model):
    __tablename__ = "Products"
    Product_id   = db.Column(db.String(10), primary_key=True)
    Variety_name = db.Column(db.String(30), nullable=False)
    Color        = db.Column(db.String(20), nullable=False)


class ProductSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Product
        sqla_session = db.session

    Product_id = fields.String(required=True)
    Variety_name = fields.String(required=True)
    Color = fields.String(required=True)


class DailyProduction(db.Model):
    __tablename__ = "Daily_production"
    Date       = db.Column(db.Date,        primary_key=True)
    Product_id = db.Column(db.String(10),  db.ForeignKey("Products.Product_id"), primary_key=True)
    Lot_number = db.Column(db.Integer,     db.ForeignKey("Lots.Lot_number"),     primary_key=True)
    Quantity   = db.Column(db.Integer,     nullable=False)


class DailyProductionSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = DailyProduction
        sqla_session = db.session

    Date = fields.Date(required=True)
    Product_id = fields.String(required=True)
    Lot_number = fields.Integer(required=True)
    Quantity = fields.Integer(required=True)


class EmployeeProduction(db.Model):
    __tablename__ = "Employee_production"
    Employee_id = db.Column(db.Integer,    db.ForeignKey("Employees.Employee_id"), primary_key=True)
    Product_id  = db.Column(db.String(10), primary_key=True)
    Date        = db.Column(db.Date,       primary_key=True)
    Lot_number  = db.Column(db.Integer,    primary_key=True)
    __table_args__ = (
        db.ForeignKeyConstraint(
            ["Date", "Product_id", "Lot_number"],
            ["Daily_production.Date", "Daily_production.Product_id", "Daily_production.Lot_number"]
        ),
    )


class EmployeeProductionSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = EmployeeProduction
        sqla_session = db.session

    Employee_id = fields.Integer(required=True)
    Product_id = fields.String(required=True)
    Date = fields.Date(required=True)
    Lot_number = fields.Integer(required=True)


class AgrochemicalProduct(db.Model):
    __tablename__ = "Agrochemical_products"
    Ag_Product_id = db.Column(db.String(20), primary_key=True)
    Name          = db.Column(db.String(30),  nullable=False)
    Description   = db.Column(db.String(100), nullable=False)



class AgrochemicalProductSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = AgrochemicalProduct
        sqla_session = db.session

    Ag_Product_id = fields.String(required=True)
    Name = fields.String(required=True)
    Description = fields.String(required=True)


class FumigationEvent(db.Model):
    __tablename__ = "Fumigation_events"
    Fumigation_id      = db.Column(db.Integer,    primary_key=True, autoincrement=True)
    Date               = db.Column(db.Date,        nullable=False)
    Lot_number         = db.Column(db.Integer,     db.ForeignKey("Lots.Lot_number"),                     nullable=False)
    Ag_Product_id      = db.Column(db.String(20),  db.ForeignKey("Agrochemical_products.Ag_Product_id"), nullable=False)
    Target_pest        = db.Column(db.String(50),  nullable=False)
    Dosage             = db.Column(db.Float,       nullable=False)
    Volume             = db.Column(db.Float,       nullable=False)
    Application_method = db.Column(db.String(50),  nullable=False)


class FumigationEventSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = FumigationEvent
        sqla_session = db.session

    Fumigation_id = fields.Integer(dump_only=True)
    Date = fields.Date(required=True)
    Lot_number = fields.Integer(required=True)
    Ag_Product_id = fields.String(required=True)
    Target_pest = fields.String(required=True)
    Dosage = fields.Float(required=True)
    Volume = fields.Float(required=True)
    Application_method = fields.String(required=True)


class EmployeeFumigation(db.Model):
    __tablename__ = "Employee_fumigation"
    Employee_id   = db.Column(db.Integer, db.ForeignKey("Employees.Employee_id"),          primary_key=True)
    Fumigation_id = db.Column(db.Integer, db.ForeignKey("Fumigation_events.Fumigation_id"), primary_key=True)


class EmployeeFumigationSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = EmployeeFumigation
        sqla_session = db.session

    Employee_id = fields.Integer(required=True)
    Fumigation_id = fields.Integer(required=True)


class MachineFumigation(db.Model):
    __tablename__ = "Machine_fumigation"
    Equip_id      = db.Column(db.String(10), db.ForeignKey("Machine_stock.Equip_id"),          primary_key=True)
    Fumigation_id = db.Column(db.Integer,    db.ForeignKey("Fumigation_events.Fumigation_id"), primary_key=True)


class MachineFumigationSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = MachineFumigation
        sqla_session = db.session

    Equip_id = fields.String(required=True)
    Fumigation_id = fields.Integer(required=True)


class DailyPostHarvest(db.Model):
    __tablename__ = "Daily_post_harvest"
    Date        = db.Column(db.Date,       primary_key=True)
    Length      = db.Column(db.Float,      primary_key=True)
    Employee_id = db.Column(db.Integer,    db.ForeignKey("Employees.Employee_id"), primary_key=True)
    Product_id  = db.Column(db.String(10), db.ForeignKey("Products.Product_id"),   primary_key=True)
    Quantity    = db.Column(db.Integer,    nullable=False)

class DailyPostHarvestSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = DailyPostHarvest
        sqla_session = db.session

    Date = fields.Date(required=True)
    Length = fields.Float(required=True)
    Employee_id = fields.Integer(required=True)
    Product_id = fields.String(required=True)
    Quantity = fields.Integer(required=True)


class City(db.Model):
    __tablename__ = "Cities"
    City_name = db.Column(db.String(30), primary_key=True)
    Country   = db.Column(db.String(30), nullable=False)

class CitySchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = City
        sqla_session = db.session

    City_name = fields.String(required=True)
    Country = fields.String(required=True)


class Customer(db.Model):
    __tablename__ = "Customers"
    Customer_id = db.Column(db.Integer,    primary_key=True, autoincrement=True)
    Name        = db.Column(db.String(50), nullable=False)
    City_name   = db.Column(db.String(30), db.ForeignKey("Cities.City_name"), nullable=False)
    Phone       = db.Column(db.String(20), nullable=False)
    Email       = db.Column(db.String(50), nullable=False, unique=True)

class CustomerSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Customer
        sqla_session = db.session

    Customer_id = fields.Integer(dump_only=True)
    Name = fields.String(required=True)
    City_name = fields.String(required=True)
    Phone = fields.String(required=True)
    Email = fields.String(required=True)


class Order(db.Model):
    __tablename__ = "Orders"
    Order_id      = db.Column(db.String(10),  primary_key=True)
    Date          = db.Column(db.Date,         nullable=False)
    Customer_id   = db.Column(db.Integer,      db.ForeignKey("Customers.Customer_id"), nullable=False)
    Dispatch_date = db.Column(db.Date,         nullable=False)
    Description   = db.Column(db.String(100),  nullable=False)

class OrderSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Order
        sqla_session = db.session

    Order_id = fields.String(required=True)
    Date = fields.Date(required=True)
    Customer_id = fields.Integer(required=True)
    Dispatch_date = fields.Date(required=True)
    Description = fields.String(required=True)


class OrderLineItem(db.Model):
    __tablename__ = "Order_line_items"
    Order_id         = db.Column(db.String(10), db.ForeignKey("Orders.Order_id"),     primary_key=True)
    Product_id       = db.Column(db.String(10), db.ForeignKey("Products.Product_id"), primary_key=True)
    Required_length  = db.Column(db.Float,   nullable=False)
    Negotiated_price = db.Column(db.Float,   nullable=False)
    Quantity         = db.Column(db.Integer, nullable=False)

class OrderLineItemSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = OrderLineItem
        sqla_session = db.session

    Order_id = fields.String(required=True)
    Product_id = fields.String(required=True)
    Required_length = fields.Float(required=True)
    Negotiated_price = fields.Float(required=True)
    Quantity = fields.Integer(required=True)


# ══════════════════════════════════════════════════════════════════════════════
# GET FUNCTION b
# ══════════════════════════════════════════════════════════════════════════════

#curl -v http://127.0.0.1:5000/companies
@app.route('/companies', methods=['GET'])
def companies():
    get_companies = Company.query.all()
    companies_schema = CompanySchema(many=True)
    companies = companies_schema.dump(get_companies)
    return make_response(jsonify({"companies": companies}))

#curl -v http://127.0.0.1:5000/departments
@app.route('/departments', methods=['GET'])
def departments():
    get_departments = Department.query.all()
    departments_schema = DepartmentSchema(many=True)
    departments = departments_schema.dump(get_departments)
    return make_response(jsonify({"departments": departments}))

#curl -v http://127.0.0.1:5000/employees
@app.route('/employees', methods=['GET'])
def employees():
    get_employees = Employee.query.all()
    employees_schema = EmployeeSchema(many=True)
    employees = employees_schema.dump(get_employees)
    return make_response(jsonify({"employees": employees}))

#curl -v http://127.0.0.1:5000/machine-stock
@app.route('/machine-stock', methods=['GET'])
def machine_stock():
    get_machine_stock = MachineStock.query.all()
    machine_stock_schema = MachineStockSchema(many=True)
    machine_stock = machine_stock_schema.dump(get_machine_stock)
    return make_response(jsonify({"machine_stock": machine_stock}))

#curl -v http://127.0.0.1:5000/lots
@app.route('/lots', methods=['GET'])
def lots():
    get_lots = Lot.query.all()
    lots_schema = LotSchema(many=True)
    lots = lots_schema.dump(get_lots)
    return make_response(jsonify({"lots": lots}))



#curl -v http://127.0.0.1:5000/products
@app.route('/products', methods=['GET'])
def products():
    get_products = Product.query.all()
    products_schema = ProductSchema(many=True)
    products = products_schema.dump(get_products)
    return make_response(jsonify({"products": products}))

#curl -v http://127.0.0.1:5000/daily-production
@app.route('/daily-production', methods=['GET'])
def daily_production():
    get_daily_production = DailyProduction.query.all()
    daily_production_schema = DailyProductionSchema(many=True)
    daily_production = daily_production_schema.dump(get_daily_production)
    return make_response(jsonify({"daily_production": daily_production}))


#curl -v http://127.0.0.1:5000/employee-production
@app.route('/employee-production', methods=['GET'])
def employee_production():
    get_employee_production = EmployeeProduction.query.all()
    employee_production_schema = EmployeeProductionSchema(many=True)
    employee_production = employee_production_schema.dump(get_employee_production)
    return make_response(jsonify({"employee_production": employee_production}))

#curl -v http://127.0.0.1:5000/agrochemical-products
@app.route('/agrochemical-products', methods=['GET'])
def agrochemical_products():
    get_agrochemical_products = AgrochemicalProduct.query.all()
    agrochemical_products_schema = AgrochemicalProductSchema(many=True)
    agrochemical_products = agrochemical_products_schema.dump(get_agrochemical_products)
    return make_response(jsonify({"agrochemical_products": agrochemical_products}))

#curl -v http://127.0.0.1:5000/fumigation-events
@app.route('/fumigation-events', methods=['GET'])
def fumigation_events():
    get_fumigation_events = FumigationEvent.query.all()
    fumigation_events_schema = FumigationEventSchema(many=True)
    fumigation_events = fumigation_events_schema.dump(get_fumigation_events)
    return make_response(jsonify({"fumigation_events": fumigation_events}))

# curl -v http://127.0.0.1:5000/employee-fumigation
@app.route('/employee-fumigation', methods=['GET'])
def employee_fumigation():
    get_employee_fumigation = EmployeeFumigation.query.all()
    employee_fumigation_schema = EmployeeFumigationSchema(many=True)
    employee_fumigation = employee_fumigation_schema.dump(get_employee_fumigation)
    return make_response(jsonify({"employee_fumigation": employee_fumigation}))

# curl -v http://127.0.0.1:5000/machine-fumigation
@app.route('/machine-fumigation', methods=['GET'])
def machine_fumigation():
    get_machine_fumigation = MachineFumigation.query.all()
    machine_fumigation_schema = MachineFumigationSchema(many=True)
    machine_fumigation = machine_fumigation_schema.dump(get_machine_fumigation)
    return make_response(jsonify({"machine_fumigation": machine_fumigation}))

# curl -v http://127.0.0.1:5000/daily-post-harvest
@app.route('/daily-post-harvest', methods=['GET'])
def daily_post_harvest():
    get_daily_post_harvest = DailyPostHarvest.query.all()
    daily_post_harvest_schema = DailyPostHarvestSchema(many=True)
    daily_post_harvest = daily_post_harvest_schema.dump(get_daily_post_harvest)
    return make_response(jsonify({"daily_post_harvest": daily_post_harvest}))

# curl -v http://127.0.0.1:5000/cities
@app.route('/cities', methods=['GET'])
def cities():
    get_cities = City.query.all()
    cities_schema = CitySchema(many=True)
    cities = cities_schema.dump(get_cities)
    return make_response(jsonify({"cities": cities}))

# curl -v http://127.0.0.1:5000/customers
@app.route('/customers', methods=['GET'])
def customers():
    get_customers = Customer.query.all()
    customers_schema = CustomerSchema(many=True)
    customers = customers_schema.dump(get_customers)
    return make_response(jsonify({"customers": customers}))

# curl -v http://127.0.0.1:5000/orders
@app.route('/orders', methods=['GET'])
def orders():
    get_orders = Order.query.all()
    orders_schema = OrderSchema(many=True)
    orders = orders_schema.dump(get_orders)
    return make_response(jsonify({"orders": orders}))

# curl -v http://127.0.0.1:5000/order-line-items
@app.route('/order-line-items', methods=['GET'])
def order_line_items():
    get_order_line_items = OrderLineItem.query.all()
    order_line_items_schema = OrderLineItemSchema(many=True)
    order_line_items = order_line_items_schema.dump(get_order_line_items)
    return make_response(jsonify({"order_line_items": order_line_items}))




# ══════════════════════════════════════════════════════════════════════════════
# POST FUNCTIONS b
# ══════════════════════════════════════════════════════════════════════════════

# POST Company
''' curl -v -X POST http://127.0.0.1:5000/companies \
-H "Content-Type: application/json" \
-d '{"RUC":1234567892,"Name":"Andes Flowers","Phone":"0999999997","Address":"Quito"}' '''

@app.route('/companies', methods=['POST'])
def create_company():
    company_data = request.get_json()

    try:
        new_company_data = CompanySchema().load(company_data)
        new_company = Company(**new_company_data)

        db.session.add(new_company)
        db.session.commit()

        company_json = CompanySchema().dump(new_company)
        return jsonify(company_json), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST Department
''' curl -v -X POST http://127.0.0.1:5000/departments \
-H "Content-Type: application/json" \
-d '{"Department_name":"Human Resources","RUC":1234567892}' '''
@app.route('/departments', methods=['POST'])
def create_department():
    department_data = request.get_json()

    try:
        new_department_data = DepartmentSchema().load(department_data)
        new_department = Department(**new_department_data)

        db.session.add(new_department)
        db.session.commit()

        department_json = DepartmentSchema().dump(new_department)
        return jsonify(department_json), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
# POST Employee
""" curl -v -X POST http://127.0.0.1:5000/employees \
-H "Content-Type: application/json" \
-d '{"Department_name":"Logistics","Hiring_date":"2025-01-10","Name":"Carlos","Last_name":"Mora","Birth_date":"1995-04-12","Role":"Worker","Sex":"M"}' """
@app.route('/employees', methods=['POST'])
def create_employee():
    employee_data = request.get_json()

    try:
        new_employee_data = EmployeeSchema().load(employee_data)
        new_employee = Employee(**new_employee_data)

        db.session.add(new_employee)
        db.session.commit()

        employee_json = EmployeeSchema().dump(new_employee)
        return jsonify(employee_json), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST Product
""" curl -v -X POST http://127.0.0.1:5000/products \
-H "Content-Type: application/json" \
-d '{"Product_id":"P010","Variety_name":"Tulip","Color":"Yellow"}' """
@app.route('/products', methods=['POST'])
def create_product():
    product_data = request.get_json()

    try:
        new_product_data = ProductSchema().load(product_data)
        new_product = Product(**new_product_data)

        db.session.add(new_product)
        db.session.commit()

        product_json = ProductSchema().dump(new_product)
        return jsonify(product_json), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
# POST MachineStock
""" curl -v -X POST http://127.0.0.1:5000/machine-stock \
-H "Content-Type: application/json" \
-d '{"Equip_id":"M010","Buy_date":"2024-05-01"}' """
@app.route('/machine-stock', methods=['POST'])
def create_machine_stock():
    machine_data = request.get_json()

    try:
        new_machine_data = MachineStockSchema().load(machine_data)
        new_machine = MachineStock(**new_machine_data)

        db.session.add(new_machine)
        db.session.commit()

        machine_json = MachineStockSchema().dump(new_machine)
        return jsonify(machine_json), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
# POST Lot
# curl -X POST http://127.0.0.1:5000/lots
@app.route('/lots', methods=['POST'])
def create_lot():
    try:
        new_lot = Lot()

        db.session.add(new_lot)
        db.session.commit()

        lot_json = LotSchema().dump(new_lot)
        return jsonify(lot_json), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
# POST DailyProduction

""" curl -v -X POST http://127.0.0.1:5000/daily-production \
-H "Content-Type: application/json" \
-d '{"Date":"2025-05-01","Product_id":"P010","Lot_number":1,"Quantity":100}' """
@app.route('/daily-production', methods=['POST'])
def create_daily_production():
    data = request.get_json()
    try:
        new_data = DailyProductionSchema().load(data)
        new_record = DailyProduction(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(DailyProductionSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST EmployeeProduction
""" curl -v -X POST http://127.0.0.1:5000/employee-production \
-H "Content-Type: application/json" \
-d '{"Employee_id":1,"Product_id":"P010","Date":"2025-05-01","Lot_number":1}' """
@app.route('/employee-production', methods=['POST'])
def create_employee_production():
    data = request.get_json()
    try:
        new_data = EmployeeProductionSchema().load(data)
        new_record = EmployeeProduction(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(EmployeeProductionSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST AgrochemicalProduct
""" curl -v -X POST http://127.0.0.1:5000/agrochemical-products \
-H "Content-Type: application/json" \
-d '{"Ag_Product_id":"AG010","Name":"Pesticide X","Description":"General pest control"}' """
@app.route('/agrochemical-products', methods=['POST'])
def create_agrochemical_product():
    data = request.get_json()
    try:
        new_data = AgrochemicalProductSchema().load(data)
        new_record = AgrochemicalProduct(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(AgrochemicalProductSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST FumigationEvent
""" curl -v -X POST http://127.0.0.1:5000/fumigation-events \
-H "Content-Type: application/json" \
-d '{"Date":"2025-05-02","Lot_number":1,"Ag_Product_id":"AG010","Target_pest":"Aphids","Dosage":2.5,"Volume":10.0,"Application_method":"Spray"}' """
@app.route('/fumigation-events', methods=['POST'])
def create_fumigation_event():
    data = request.get_json()
    try:
        new_data = FumigationEventSchema().load(data)
        new_record = FumigationEvent(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(FumigationEventSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST EmployeeFumigation
""" curl -v -X POST http://127.0.0.1:5000/employee-fumigation \
-H "Content-Type: application/json" \
-d '{"Employee_id":2,"Fumigation_id":2}' """
@app.route('/employee-fumigation', methods=['POST'])
def create_employee_fumigation():
    data = request.get_json()
    try:
        new_data = EmployeeFumigationSchema().load(data)
        new_record = EmployeeFumigation(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(EmployeeFumigationSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST MachineFumigation
""" curl -v -X POST http://127.0.0.1:5000/machine-fumigation \
-H "Content-Type: application/json" \
-d '{"Equip_id":"M010","Fumigation_id":1}' """
@app.route('/machine-fumigation', methods=['POST'])
def create_machine_fumigation():
    data = request.get_json()
    try:
        new_data = MachineFumigationSchema().load(data)
        new_record = MachineFumigation(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(MachineFumigationSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST DailyPostHarvest
""" curl -v -X POST http://127.0.0.1:5000/daily-post-harvest \
-H "Content-Type: application/json" \
-d '{"Date":"2025-05-03","Length":50,"Employee_id":1,"Product_id":"P010","Quantity":80}' """
@app.route('/daily-post-harvest', methods=['POST'])
def create_daily_post_harvest():
    data = request.get_json()
    try:
        new_data = DailyPostHarvestSchema().load(data)
        new_record = DailyPostHarvest(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(DailyPostHarvestSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST City
""" curl -v -X POST http://127.0.0.1:5000/cities \
-H "Content-Type: application/json" \
-d '{"City_name":"Guayaquil","Country":"Ecuador"}' """
@app.route('/cities', methods=['POST'])
def create_city():
    data = request.get_json()
    try:
        new_data = CitySchema().load(data)
        new_record = City(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(CitySchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST Customer
""" curl -v -X POST http://127.0.0.1:5000/customers \
-H "Content-Type: application/json" \
-d '{"Name":"Florist Corp","City_name":"Quito","Phone":"0988888888","Email":"contact2@florist.com"}' """
@app.route('/customers', methods=['POST'])
def create_customer():
    data = request.get_json()
    try:
        new_data = CustomerSchema().load(data)
        new_record = Customer(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(CustomerSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST Order
""" curl -v -X POST http://127.0.0.1:5000/orders \
-H "Content-Type: application/json" \
-d '{"Order_id":"ORD010","Date":"2025-05-04","Customer_id":1,"Dispatch_date":"2025-05-06","Description":"Flower order"}' """
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    try:
        new_data = OrderSchema().load(data)
        new_record = Order(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(OrderSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# POST OrderLineItem
""" curl -v -X POST http://127.0.0.1:5000/order-line-items \
-H "Content-Type: application/json" \
-d '{"Order_id":"ORD010","Product_id":"P010","Required_length":50,"Negotiated_price":1.5,"Quantity":200}' """
@app.route('/order-line-items', methods=['POST'])
def create_order_line_item():
    data = request.get_json()
    try:
        new_data = OrderLineItemSchema().load(data)
        new_record = OrderLineItem(**new_data)
        db.session.add(new_record)
        db.session.commit()
        return jsonify(OrderLineItemSchema().dump(new_record)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ══════════════════════════════════════════════════════════════════════════════
# DELETE FUNCTIONS b
# ══════════════════════════════════════════════════════════════════════════════

# DELETE Company
# curl -X DELETE http://127.0.0.1:5000/companies/1234567892
@app.route('/companies/<int:RUC>', methods=['DELETE'])
def delete_company(RUC):
    company = Company.query.get(RUC)

    if not company:
        return jsonify({"error": "Company not found"}), 404

    try:
        db.session.delete(company)
        db.session.commit()
        return jsonify({"message": "Company deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE Department
# curl -X DELETE http://127.0.0.1:5000/departments/Logistics
@app.route('/departments/<string:Department_name>', methods=['DELETE'])
def delete_department(Department_name):
    department = Department.query.get(Department_name)

    if not department:
        return jsonify({"error": "Department not found"}), 404

    try:
        db.session.delete(department)
        db.session.commit()
        return jsonify({"message": "Department deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE Employee
# curl -X DELETE http://127.0.0.1:5000/employees/1
@app.route('/employees/<int:Employee_id>', methods=['DELETE'])
def delete_employee(Employee_id):
    employee = Employee.query.get(Employee_id)

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({"message": "Employee deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE MachineStock
# curl -X DELETE http://127.0.0.1:5000/machine-stock/M010
@app.route('/machine-stock/<string:Equip_id>', methods=['DELETE'])
def delete_machine_stock(Equip_id):
    machine = MachineStock.query.get(Equip_id)

    if not machine:
        return jsonify({"error": "Machine not found"}), 404

    try:
        db.session.delete(machine)
        db.session.commit()
        return jsonify({"message": "Machine deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE Lot
# curl -X DELETE http://127.0.0.1:5000/lots/1
@app.route('/lots/<int:Lot_number>', methods=['DELETE'])
def delete_lot(Lot_number):
    lot = Lot.query.get(Lot_number)

    if not lot:
        return jsonify({"error": "Lot not found"}), 404

    try:
        db.session.delete(lot)
        db.session.commit()
        return jsonify({"message": "Lot deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE Product
# curl -X DELETE http://127.0.0.1:5000/products/P010
@app.route('/products/<string:Product_id>', methods=['DELETE'])
def delete_product(Product_id):
    product = Product.query.get(Product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE DailyProduction
# curl -X DELETE http://127.0.0.1:5000/daily-production/2025-05-01/P010/1
@app.route('/daily-production/<string:Date>/<string:Product_id>/<int:Lot_number>', methods=['DELETE'])
def delete_daily_production(Date, Product_id, Lot_number):

    production = DailyProduction.query.get((Date, Product_id, Lot_number))

    if not production:
        return jsonify({"error": "Daily production not found"}), 404

    try:
        db.session.delete(production)
        db.session.commit()
        return jsonify({"message": "Daily production deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE EmployeeProduction
# curl -X DELETE http://127.0.0.1:5000/employee-production/1/P010/2025-05-01/1
@app.route('/employee-production/<int:Employee_id>/<string:Product_id>/<string:Date>/<int:Lot_number>', methods=['DELETE'])
def delete_employee_production(Employee_id, Product_id, Date, Lot_number):

    record = EmployeeProduction.query.get((Employee_id, Product_id, Date, Lot_number))

    if not record:
        return jsonify({"error": "Employee production not found"}), 404

    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Employee production deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    
# curl -v -X DELETE http://127.0.0.1:5000/agrochemical-products/AG010
@app.route('/agrochemical-products/<string:Ag_Product_id>', methods=['DELETE'])
def delete_agrochemical_product(Ag_Product_id):

    product = AgrochemicalProduct.query.get(Ag_Product_id)

    if not product:
        return jsonify({"error": "Agrochemical product not found"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Agrochemical product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE FumigationEvent
@app.route('/fumigation-events/<int:Fumigation_id>', methods=['DELETE'])
def delete_fumigation_event(Fumigation_id):

    fumigation = FumigationEvent.query.get(Fumigation_id)

    if not fumigation:
        return jsonify({"error": "Fumigation event not found"}), 404

    try:
        db.session.delete(fumigation)
        db.session.commit()
        return jsonify({"message": "Fumigation event deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE EmployeeFumigation
@app.route('/employee-fumigation/<int:Employee_id>/<int:Fumigation_id>', methods=['DELETE'])
def delete_employee_fumigation(Employee_id, Fumigation_id):

    record = EmployeeFumigation.query.get((Employee_id, Fumigation_id))

    if not record:
        return jsonify({"error": "Employee fumigation not found"}), 404

    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Employee fumigation deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE MachineFumigation
@app.route('/machine-fumigation/<string:Equip_id>/<int:Fumigation_id>', methods=['DELETE'])
def delete_machine_fumigation(Equip_id, Fumigation_id):

    record = MachineFumigation.query.get((Equip_id, Fumigation_id))

    if not record:
        return jsonify({"error": "Machine fumigation not found"}), 404

    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Machine fumigation deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE DailyPostHarvest
@app.route('/daily-post-harvest/<string:Date>/<float:Length>/<int:Employee_id>/<string:Product_id>', methods=['DELETE'])
def delete_daily_post_harvest(Date, Length, Employee_id, Product_id):

    record = DailyPostHarvest.query.get((Date, Length, Employee_id, Product_id))

    if not record:
        return jsonify({"error": "Daily post harvest not found"}), 404

    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Daily post harvest deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE City
@app.route('/cities/<string:City_name>', methods=['DELETE'])
def delete_city(City_name):

    city = City.query.get(City_name)

    if not city:
        return jsonify({"error": "City not found"}), 404

    try:
        db.session.delete(city)
        db.session.commit()
        return jsonify({"message": "City deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE Customer
@app.route('/customers/<int:Customer_id>', methods=['DELETE'])
def delete_customer(Customer_id):

    customer = Customer.query.get(Customer_id)

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    try:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({"message": "Customer deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE Order
@app.route('/orders/<string:Order_id>', methods=['DELETE'])
def delete_order(Order_id):

    order = Order.query.get(Order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    try:
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# DELETE OrderLineItem
@app.route('/order-line-items/<string:Order_id>/<string:Product_id>', methods=['DELETE'])
def delete_order_line_item(Order_id, Product_id):

    item = OrderLineItem.query.get((Order_id, Product_id))

    if not item:
        return jsonify({"error": "Order line item not found"}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Order line item deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route('/seed', methods=['GET'])
def seed_database():
    try:
        # 1. Ensure tables are created
        db.create_all()

        # 2. Prevent duplicate seeding
        if Product.query.first():
            return jsonify({"message": "Database is already seeded! You are good to go."}), 200

        # 3. Create the missing parent data using the EXACT model fields
        # Using the Ger-001 you tried to insert earlier
        product1 = Product(Product_id='Ger-001', Variety_name='Gerbera Daisy', Color='Pink') 
        product2 = Product(Product_id='P010', Variety_name='Freedom Rose', Color='Red')

        # Since Lot_number is autoincrement, we can explicitly set it to 1 to match your frontend test
        lot1 = Lot(Lot_number=1) 

        # 4. Save to the database
        db.session.add_all([product1, product2, lot1])
        db.session.commit()

        return jsonify({"message": "Database successfully seeded with master data!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to seed: {str(e)}"}), 400







if __name__ == "__main__":
    app.run(debug=True)



