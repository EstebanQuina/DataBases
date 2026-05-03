"""
Flask-SQLAlchemy RESTful API
Commercial Flower Production Enterprise
Authors: Esteban Quiña & Marcial Valero — Yachay Tech University
Full CRUD implementation for all entities
"""

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import date

app = Flask(__name__)

# ── Configuration ──────────────────────────────────────────────────────────────
# Switch URI to your MySQL container:
# mysql+pymysql://root:YOUR_PASSWORD@127.0.0.1:3306/flower_production
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:1943-me@127.0.0.1:3306/flower_production"
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


class Department(db.Model):
    __tablename__ = "Departments"
    Department_name = db.Column(db.String(30), primary_key=True)
    RUC             = db.Column(db.Integer, db.ForeignKey("Company.RUC"), nullable=False)


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


class MachineStock(db.Model):
    __tablename__ = "Machine_stock"
    Equip_id  = db.Column(db.String(10), primary_key=True)
    Buy_date  = db.Column(db.Date, nullable=False)


class Lot(db.Model):
    __tablename__ = "Lots"
    Lot_number = db.Column(db.Integer, primary_key=True, autoincrement=True)


class Product(db.Model):
    __tablename__ = "Products"
    Product_id   = db.Column(db.String(10), primary_key=True)
    Variety_name = db.Column(db.String(30), nullable=False)
    Color        = db.Column(db.String(20), nullable=False)


class DailyProduction(db.Model):
    __tablename__ = "Daily_production"
    Date       = db.Column(db.Date,        primary_key=True)
    Product_id = db.Column(db.String(10),  db.ForeignKey("Products.Product_id"), primary_key=True)
    Lot_number = db.Column(db.Integer,     db.ForeignKey("Lots.Lot_number"),     primary_key=True)
    Quantity   = db.Column(db.Integer,     nullable=False)


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


class AgrochemicalProduct(db.Model):
    __tablename__ = "Agrochemical_products"
    Ag_Product_id = db.Column(db.String(20), primary_key=True)
    Name          = db.Column(db.String(30),  nullable=False)
    Description   = db.Column(db.String(100), nullable=False)


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


class EmployeeFumigation(db.Model):
    __tablename__ = "Employee_fumigation"
    Employee_id   = db.Column(db.Integer, db.ForeignKey("Employees.Employee_id"),          primary_key=True)
    Fumigation_id = db.Column(db.Integer, db.ForeignKey("Fumigation_events.Fumigation_id"), primary_key=True)


class MachineFumigation(db.Model):
    __tablename__ = "Machine_fumigation"
    Equip_id      = db.Column(db.String(10), db.ForeignKey("Machine_stock.Equip_id"),          primary_key=True)
    Fumigation_id = db.Column(db.Integer,    db.ForeignKey("Fumigation_events.Fumigation_id"), primary_key=True)


class DailyPostHarvest(db.Model):
    __tablename__ = "Daily_post_harvest"
    Date        = db.Column(db.Date,       primary_key=True)
    Length      = db.Column(db.Float,      primary_key=True)
    Employee_id = db.Column(db.Integer,    db.ForeignKey("Employees.Employee_id"), primary_key=True)
    Product_id  = db.Column(db.String(10), db.ForeignKey("Products.Product_id"),   primary_key=True)
    Quantity    = db.Column(db.Integer,    nullable=False)


class City(db.Model):
    __tablename__ = "Cities"
    City_name = db.Column(db.String(30), primary_key=True)
    Country   = db.Column(db.String(30), nullable=False)


class Customer(db.Model):
    __tablename__ = "Customers"
    Customer_id = db.Column(db.Integer,    primary_key=True, autoincrement=True)
    Name        = db.Column(db.String(50), nullable=False)
    City_name   = db.Column(db.String(30), db.ForeignKey("Cities.City_name"), nullable=False)
    Phone       = db.Column(db.String(20), nullable=False)
    Email       = db.Column(db.String(50), nullable=False, unique=True)


class Order(db.Model):
    __tablename__ = "Orders"
    Order_id      = db.Column(db.String(10),  primary_key=True)
    Date          = db.Column(db.Date,         nullable=False)
    Customer_id   = db.Column(db.Integer,      db.ForeignKey("Customers.Customer_id"), nullable=False)
    Dispatch_date = db.Column(db.Date,         nullable=False)
    Description   = db.Column(db.String(100),  nullable=False)


class OrderLineItem(db.Model):
    __tablename__ = "Order_line_items"
    Order_id         = db.Column(db.String(10), db.ForeignKey("Orders.Order_id"),     primary_key=True)
    Product_id       = db.Column(db.String(10), db.ForeignKey("Products.Product_id"), primary_key=True)
    Required_length  = db.Column(db.Float,   nullable=False)
    Negotiated_price = db.Column(db.Float,   nullable=False)
    Quantity         = db.Column(db.Integer, nullable=False)


# ══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def err(msg, code=400):
    return jsonify({"error": msg}), code

def ok(data, code=200):
    return jsonify(data), code


# ══════════════════════════════════════════════════════════════════════════════
# COMPANY  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/companies", methods=["GET"])
def get_companies():
    rows = Company.query.all()
    return ok([{"ruc": c.RUC, "name": c.Name, "phone": c.Phone, "address": c.Address} for c in rows])

@app.route("/companies/<int:ruc>", methods=["GET"])
def get_company(ruc):
    c = Company.query.get_or_404(ruc)
    return ok({"ruc": c.RUC, "name": c.Name, "phone": c.Phone, "address": c.Address})

@app.route("/companies", methods=["POST"])
def create_company():
    d = request.get_json()
    if not all(k in d for k in ["ruc", "name", "phone", "address"]):
        return err("Missing fields: ruc, name, phone, address")
    c = Company(RUC=d["ruc"], Name=d["name"], Phone=d["phone"], Address=d["address"])
    db.session.add(c)
    db.session.commit()
    return ok({"message": "Company created", "ruc": c.RUC}, 201)

@app.route("/companies/<int:ruc>", methods=["PUT"])
def update_company(ruc):
    c = Company.query.get_or_404(ruc)
    d = request.get_json()
    if "name" in d:    c.Name    = d["name"]
    if "phone" in d:   c.Phone   = d["phone"]
    if "address" in d: c.Address = d["address"]
    db.session.commit()
    return ok({"message": "Company updated"})

@app.route("/companies/<int:ruc>", methods=["DELETE"])
def delete_company(ruc):
    c = Company.query.get_or_404(ruc)
    db.session.delete(c)
    db.session.commit()
    return ok({"message": "Company deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# DEPARTMENTS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/departments", methods=["GET"])
def get_departments():
    rows = Department.query.all()
    return ok([{"department_name": d.Department_name, "ruc": d.RUC} for d in rows])

@app.route("/departments/<name>", methods=["GET"])
def get_department(name):
    d = Department.query.get_or_404(name)
    return ok({"department_name": d.Department_name, "ruc": d.RUC})

@app.route("/departments", methods=["POST"])
def create_department():
    d = request.get_json()
    if not all(k in d for k in ["department_name", "ruc"]):
        return err("Missing fields: department_name, ruc")
    dept = Department(Department_name=d["department_name"], RUC=d["ruc"])
    db.session.add(dept)
    db.session.commit()
    return ok({"message": "Department created"}, 201)

@app.route("/departments/<name>", methods=["PUT"])
def update_department(name):
    dept = Department.query.get_or_404(name)
    d = request.get_json()
    if "ruc" in d: dept.RUC = d["ruc"]
    db.session.commit()
    return ok({"message": "Department updated"})

@app.route("/departments/<name>", methods=["DELETE"])
def delete_department(name):
    dept = Department.query.get_or_404(name)
    db.session.delete(dept)
    db.session.commit()
    return ok({"message": "Department deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# EMPLOYEES  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/employees", methods=["GET"])
def get_employees():
    rows = Employee.query.all()
    return ok([{
        "employee_id": e.Employee_id, "name": e.Name, "last_name": e.Last_name,
        "department": e.Department_name, "role": e.Role,
        "hiring_date": str(e.Hiring_date), "sex": e.Sex
    } for e in rows])

@app.route("/employees/<int:eid>", methods=["GET"])
def get_employee(eid):
    e = Employee.query.get_or_404(eid)
    return ok({"employee_id": e.Employee_id, "name": e.Name, "last_name": e.Last_name,
               "department": e.Department_name, "role": e.Role,
               "hiring_date": str(e.Hiring_date), "birth_date": str(e.Birth_date), "sex": e.Sex})

@app.route("/employees", methods=["POST"])
def create_employee():
    d = request.get_json()
    required = ["department_name", "hiring_date", "name", "last_name", "birth_date", "role", "sex"]
    if not all(k in d for k in required):
        return err(f"Missing fields. Required: {required}")
    emp = Employee(
        Department_name=d["department_name"],
        Hiring_date=date.fromisoformat(d["hiring_date"]),
        Name=d["name"], Last_name=d["last_name"],
        Birth_date=date.fromisoformat(d["birth_date"]),
        Role=d["role"], Sex=d["sex"]
    )
    db.session.add(emp)
    db.session.commit()
    return ok({"message": "Employee created", "employee_id": emp.Employee_id}, 201)

@app.route("/employees/<int:eid>", methods=["PUT"])
def update_employee(eid):
    e = Employee.query.get_or_404(eid)
    d = request.get_json()
    if "name" in d:            e.Name = d["name"]
    if "last_name" in d:       e.Last_name = d["last_name"]
    if "role" in d:            e.Role = d["role"]
    if "department_name" in d: e.Department_name = d["department_name"]
    db.session.commit()
    return ok({"message": "Employee updated"})

@app.route("/employees/<int:eid>", methods=["DELETE"])
def delete_employee(eid):
    e = Employee.query.get_or_404(eid)
    db.session.delete(e)
    db.session.commit()
    return ok({"message": "Employee deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# MACHINE STOCK  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/machines", methods=["GET"])
def get_machines():
    rows = MachineStock.query.all()
    return ok([{"equip_id": m.Equip_id, "buy_date": str(m.Buy_date)} for m in rows])

@app.route("/machines/<eid>", methods=["GET"])
def get_machine(eid):
    m = MachineStock.query.get_or_404(eid)
    return ok({"equip_id": m.Equip_id, "buy_date": str(m.Buy_date)})

@app.route("/machines", methods=["POST"])
def create_machine():
    d = request.get_json()
    if not all(k in d for k in ["equip_id", "buy_date"]):
        return err("Missing fields: equip_id, buy_date")
    m = MachineStock(Equip_id=d["equip_id"], Buy_date=date.fromisoformat(d["buy_date"]))
    db.session.add(m)
    db.session.commit()
    return ok({"message": "Machine created", "equip_id": m.Equip_id}, 201)

@app.route("/machines/<eid>", methods=["PUT"])
def update_machine(eid):
    m = MachineStock.query.get_or_404(eid)
    d = request.get_json()
    if "buy_date" in d: m.Buy_date = date.fromisoformat(d["buy_date"])
    db.session.commit()
    return ok({"message": "Machine updated"})

@app.route("/machines/<eid>", methods=["DELETE"])
def delete_machine(eid):
    m = MachineStock.query.get_or_404(eid)
    db.session.delete(m)
    db.session.commit()
    return ok({"message": "Machine deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# LOTS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/lots", methods=["GET"])
def get_lots():
    rows = Lot.query.all()
    return ok([{"lot_number": l.Lot_number} for l in rows])

@app.route("/lots/<int:lnum>", methods=["GET"])
def get_lot(lnum):
    l = Lot.query.get_or_404(lnum)
    return ok({"lot_number": l.Lot_number})

@app.route("/lots", methods=["POST"])
def create_lot():
    l = Lot()
    db.session.add(l)
    db.session.commit()
    return ok({"message": "Lot created", "lot_number": l.Lot_number}, 201)

@app.route("/lots/<int:lnum>", methods=["DELETE"])
def delete_lot(lnum):
    l = Lot.query.get_or_404(lnum)
    db.session.delete(l)
    db.session.commit()
    return ok({"message": "Lot deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# PRODUCTS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/products", methods=["GET"])
def get_products():
    rows = Product.query.all()
    return ok([{"product_id": p.Product_id, "variety": p.Variety_name, "color": p.Color} for p in rows])

@app.route("/products/<pid>", methods=["GET"])
def get_product(pid):
    p = Product.query.get_or_404(pid)
    return ok({"product_id": p.Product_id, "variety": p.Variety_name, "color": p.Color})

@app.route("/products", methods=["POST"])
def create_product():
    d = request.get_json()
    if not all(k in d for k in ["product_id", "variety_name", "color"]):
        return err("Missing fields: product_id, variety_name, color")
    p = Product(Product_id=d["product_id"], Variety_name=d["variety_name"], Color=d["color"])
    db.session.add(p)
    db.session.commit()
    return ok({"message": "Product created", "product_id": p.Product_id}, 201)

@app.route("/products/<pid>", methods=["PUT"])
def update_product(pid):
    p = Product.query.get_or_404(pid)
    d = request.get_json()
    if "variety_name" in d: p.Variety_name = d["variety_name"]
    if "color" in d:        p.Color = d["color"]
    db.session.commit()
    return ok({"message": "Product updated"})

@app.route("/products/<pid>", methods=["DELETE"])
def delete_product(pid):
    p = Product.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return ok({"message": "Product deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# DAILY PRODUCTION  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/productions", methods=["GET"])
def get_productions():
    rows = DailyProduction.query.all()
    return ok([{"date": str(r.Date), "product_id": r.Product_id,
                "lot_number": r.Lot_number, "quantity": r.Quantity} for r in rows])

@app.route("/productions", methods=["POST"])
def create_production():
    d = request.get_json()
    if not all(k in d for k in ["date", "product_id", "lot_number", "quantity"]):
        return err("Missing fields: date, product_id, lot_number, quantity")
    r = DailyProduction(Date=date.fromisoformat(d["date"]), Product_id=d["product_id"],
                        Lot_number=d["lot_number"], Quantity=d["quantity"])
    db.session.add(r)
    db.session.commit()
    return ok({"message": "Production entry created"}, 201)

@app.route("/productions/<prod_date>/<pid>/<int:lnum>", methods=["PUT"])
def update_production(prod_date, pid, lnum):
    r = DailyProduction.query.get_or_404((date.fromisoformat(prod_date), pid, lnum))
    d = request.get_json()
    if "quantity" in d: r.Quantity = d["quantity"]
    db.session.commit()
    return ok({"message": "Production entry updated"})

@app.route("/productions/<prod_date>/<pid>/<int:lnum>", methods=["DELETE"])
def delete_production(prod_date, pid, lnum):
    r = DailyProduction.query.get_or_404((date.fromisoformat(prod_date), pid, lnum))
    db.session.delete(r)
    db.session.commit()
    return ok({"message": "Production entry deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# AGROCHEMICAL PRODUCTS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/agrochemicals", methods=["GET"])
def get_agrochemicals():
    rows = AgrochemicalProduct.query.all()
    return ok([{"ag_product_id": a.Ag_Product_id, "name": a.Name, "description": a.Description} for a in rows])

@app.route("/agrochemicals/<aid>", methods=["GET"])
def get_agrochemical(aid):
    a = AgrochemicalProduct.query.get_or_404(aid)
    return ok({"ag_product_id": a.Ag_Product_id, "name": a.Name, "description": a.Description})

@app.route("/agrochemicals", methods=["POST"])
def create_agrochemical():
    d = request.get_json()
    if not all(k in d for k in ["ag_product_id", "name", "description"]):
        return err("Missing fields: ag_product_id, name, description")
    a = AgrochemicalProduct(Ag_Product_id=d["ag_product_id"], Name=d["name"], Description=d["description"])
    db.session.add(a)
    db.session.commit()
    return ok({"message": "Agrochemical product created"}, 201)

@app.route("/agrochemicals/<aid>", methods=["PUT"])
def update_agrochemical(aid):
    a = AgrochemicalProduct.query.get_or_404(aid)
    d = request.get_json()
    if "name" in d:        a.Name = d["name"]
    if "description" in d: a.Description = d["description"]
    db.session.commit()
    return ok({"message": "Agrochemical product updated"})

@app.route("/agrochemicals/<aid>", methods=["DELETE"])
def delete_agrochemical(aid):
    a = AgrochemicalProduct.query.get_or_404(aid)
    db.session.delete(a)
    db.session.commit()
    return ok({"message": "Agrochemical product deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# FUMIGATION EVENTS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/fumigations", methods=["GET"])
def get_fumigations():
    rows = FumigationEvent.query.all()
    return ok([{"fumigation_id": f.Fumigation_id, "date": str(f.Date),
                "lot_number": f.Lot_number, "ag_product_id": f.Ag_Product_id,
                "target_pest": f.Target_pest, "dosage": f.Dosage,
                "volume": f.Volume, "method": f.Application_method} for f in rows])

@app.route("/fumigations/<int:fid>", methods=["GET"])
def get_fumigation(fid):
    f = FumigationEvent.query.get_or_404(fid)
    return ok({"fumigation_id": f.Fumigation_id, "date": str(f.Date),
               "lot_number": f.Lot_number, "ag_product_id": f.Ag_Product_id,
               "target_pest": f.Target_pest, "dosage": f.Dosage,
               "volume": f.Volume, "method": f.Application_method})

@app.route("/fumigations", methods=["POST"])
def create_fumigation():
    d = request.get_json()
    required = ["date", "lot_number", "ag_product_id", "target_pest", "dosage", "volume", "application_method"]
    if not all(k in d for k in required):
        return err(f"Missing fields. Required: {required}")
    f = FumigationEvent(
        Date=date.fromisoformat(d["date"]), Lot_number=d["lot_number"],
        Ag_Product_id=d["ag_product_id"], Target_pest=d["target_pest"],
        Dosage=d["dosage"], Volume=d["volume"], Application_method=d["application_method"]
    )
    db.session.add(f)
    db.session.commit()
    return ok({"message": "Fumigation event created", "fumigation_id": f.Fumigation_id}, 201)

@app.route("/fumigations/<int:fid>", methods=["PUT"])
def update_fumigation(fid):
    f = FumigationEvent.query.get_or_404(fid)
    d = request.get_json()
    if "target_pest" in d:        f.Target_pest = d["target_pest"]
    if "dosage" in d:             f.Dosage = d["dosage"]
    if "volume" in d:             f.Volume = d["volume"]
    if "application_method" in d: f.Application_method = d["application_method"]
    db.session.commit()
    return ok({"message": "Fumigation event updated"})

@app.route("/fumigations/<int:fid>", methods=["DELETE"])
def delete_fumigation(fid):
    f = FumigationEvent.query.get_or_404(fid)
    db.session.delete(f)
    db.session.commit()
    return ok({"message": "Fumigation event deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE-FUMIGATION BRIDGE  ── Create + Read + Delete
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/fumigations/<int:fid>/employees", methods=["GET"])
def get_fumigation_employees(fid):
    rows = EmployeeFumigation.query.filter_by(Fumigation_id=fid).all()
    return ok([{"employee_id": r.Employee_id, "fumigation_id": r.Fumigation_id} for r in rows])

@app.route("/fumigations/<int:fid>/employees", methods=["POST"])
def add_fumigation_employee(fid):
    d = request.get_json()
    if "employee_id" not in d:
        return err("Missing field: employee_id")
    r = EmployeeFumigation(Employee_id=d["employee_id"], Fumigation_id=fid)
    db.session.add(r)
    db.session.commit()
    return ok({"message": "Employee assigned to fumigation"}, 201)

@app.route("/fumigations/<int:fid>/employees/<int:eid>", methods=["DELETE"])
def remove_fumigation_employee(fid, eid):
    r = EmployeeFumigation.query.get_or_404((eid, fid))
    db.session.delete(r)
    db.session.commit()
    return ok({"message": "Employee removed from fumigation"})


# ══════════════════════════════════════════════════════════════════════════════
# MACHINE-FUMIGATION BRIDGE  ── Create + Read + Delete
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/fumigations/<int:fid>/machines", methods=["GET"])
def get_fumigation_machines(fid):
    rows = MachineFumigation.query.filter_by(Fumigation_id=fid).all()
    return ok([{"equip_id": r.Equip_id, "fumigation_id": r.Fumigation_id} for r in rows])

@app.route("/fumigations/<int:fid>/machines", methods=["POST"])
def add_fumigation_machine(fid):
    d = request.get_json()
    if "equip_id" not in d:
        return err("Missing field: equip_id")
    r = MachineFumigation(Equip_id=d["equip_id"], Fumigation_id=fid)
    db.session.add(r)
    db.session.commit()
    return ok({"message": "Machine assigned to fumigation"}, 201)

@app.route("/fumigations/<int:fid>/machines/<eid>", methods=["DELETE"])
def remove_fumigation_machine(fid, eid):
    r = MachineFumigation.query.get_or_404((eid, fid))
    db.session.delete(r)
    db.session.commit()
    return ok({"message": "Machine removed from fumigation"})


# ══════════════════════════════════════════════════════════════════════════════
# DAILY POST-HARVEST  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/postharvest", methods=["GET"])
def get_postharvest():
    rows = DailyPostHarvest.query.all()
    return ok([{"date": str(r.Date), "length": r.Length, "employee_id": r.Employee_id,
                "product_id": r.Product_id, "quantity": r.Quantity} for r in rows])

@app.route("/postharvest", methods=["POST"])
def create_postharvest():
    d = request.get_json()
    if not all(k in d for k in ["date", "length", "employee_id", "product_id", "quantity"]):
        return err("Missing fields: date, length, employee_id, product_id, quantity")
    if d["length"] not in [40, 45, 50, 55]:
        return err("length must be one of: 40, 45, 50, 55")
    r = DailyPostHarvest(Date=date.fromisoformat(d["date"]), Length=d["length"],
                         Employee_id=d["employee_id"], Product_id=d["product_id"],
                         Quantity=d["quantity"])
    db.session.add(r)
    db.session.commit()
    return ok({"message": "Post-harvest entry created"}, 201)

@app.route("/postharvest/<ph_date>/<float:length>/<int:eid>/<pid>", methods=["PUT"])
def update_postharvest(ph_date, length, eid, pid):
    r = DailyPostHarvest.query.get_or_404((date.fromisoformat(ph_date), length, eid, pid))
    d = request.get_json()
    if "quantity" in d: r.Quantity = d["quantity"]
    db.session.commit()
    return ok({"message": "Post-harvest entry updated"})

@app.route("/postharvest/<ph_date>/<float:length>/<int:eid>/<pid>", methods=["DELETE"])
def delete_postharvest(ph_date, length, eid, pid):
    r = DailyPostHarvest.query.get_or_404((date.fromisoformat(ph_date), length, eid, pid))
    db.session.delete(r)
    db.session.commit()
    return ok({"message": "Post-harvest entry deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# CITIES  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/cities", methods=["GET"])
def get_cities():
    rows = City.query.all()
    return ok([{"city_name": c.City_name, "country": c.Country} for c in rows])

@app.route("/cities/<name>", methods=["GET"])
def get_city(name):
    c = City.query.get_or_404(name)
    return ok({"city_name": c.City_name, "country": c.Country})

@app.route("/cities", methods=["POST"])
def create_city():
    d = request.get_json()
    if not all(k in d for k in ["city_name", "country"]):
        return err("Missing fields: city_name, country")
    c = City(City_name=d["city_name"], Country=d["country"])
    db.session.add(c)
    db.session.commit()
    return ok({"message": "City created"}, 201)

@app.route("/cities/<name>", methods=["PUT"])
def update_city(name):
    c = City.query.get_or_404(name)
    d = request.get_json()
    if "country" in d: c.Country = d["country"]
    db.session.commit()
    return ok({"message": "City updated"})

@app.route("/cities/<name>", methods=["DELETE"])
def delete_city(name):
    c = City.query.get_or_404(name)
    db.session.delete(c)
    db.session.commit()
    return ok({"message": "City deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# CUSTOMERS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/customers", methods=["GET"])
def get_customers():
    rows = Customer.query.all()
    return ok([{"customer_id": c.Customer_id, "name": c.Name,
                "city": c.City_name, "phone": c.Phone, "email": c.Email} for c in rows])

@app.route("/customers/<int:cid>", methods=["GET"])
def get_customer(cid):
    c = Customer.query.get_or_404(cid)
    return ok({"customer_id": c.Customer_id, "name": c.Name,
               "city": c.City_name, "phone": c.Phone, "email": c.Email})

@app.route("/customers", methods=["POST"])
def create_customer():
    d = request.get_json()
    if not all(k in d for k in ["name", "city_name", "phone", "email"]):
        return err("Missing fields: name, city_name, phone, email")
    c = Customer(Name=d["name"], City_name=d["city_name"], Phone=d["phone"], Email=d["email"])
    db.session.add(c)
    db.session.commit()
    return ok({"message": "Customer created", "customer_id": c.Customer_id}, 201)

@app.route("/customers/<int:cid>", methods=["PUT"])
def update_customer(cid):
    c = Customer.query.get_or_404(cid)
    d = request.get_json()
    if "name" in d:      c.Name = d["name"]
    if "phone" in d:     c.Phone = d["phone"]
    if "email" in d:     c.Email = d["email"]
    if "city_name" in d: c.City_name = d["city_name"]
    db.session.commit()
    return ok({"message": "Customer updated"})

@app.route("/customers/<int:cid>", methods=["DELETE"])
def delete_customer(cid):
    c = Customer.query.get_or_404(cid)
    db.session.delete(c)
    db.session.commit()
    return ok({"message": "Customer deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# ORDERS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/orders", methods=["GET"])
def get_orders():
    rows = Order.query.all()
    return ok([{"order_id": o.Order_id, "date": str(o.Date),
                "customer_id": o.Customer_id, "dispatch_date": str(o.Dispatch_date),
                "description": o.Description} for o in rows])

@app.route("/orders/<oid>", methods=["GET"])
def get_order(oid):
    o = Order.query.get_or_404(oid)
    items = OrderLineItem.query.filter_by(Order_id=oid).all()
    return ok({
        "order_id": o.Order_id, "date": str(o.Date),
        "customer_id": o.Customer_id, "dispatch_date": str(o.Dispatch_date),
        "description": o.Description,
        "line_items": [{"product_id": i.Product_id, "required_length": i.Required_length,
                        "negotiated_price": i.Negotiated_price, "quantity": i.Quantity}
                       for i in items]
    })

@app.route("/orders", methods=["POST"])
def create_order():
    d = request.get_json()
    if not all(k in d for k in ["order_id", "date", "customer_id", "dispatch_date", "description"]):
        return err("Missing fields: order_id, date, customer_id, dispatch_date, description")
    o = Order(Order_id=d["order_id"], Date=date.fromisoformat(d["date"]),
              Customer_id=d["customer_id"], Dispatch_date=date.fromisoformat(d["dispatch_date"]),
              Description=d["description"])
    db.session.add(o)
    db.session.commit()
    return ok({"message": "Order created", "order_id": o.Order_id}, 201)

@app.route("/orders/<oid>", methods=["PUT"])
def update_order(oid):
    o = Order.query.get_or_404(oid)
    d = request.get_json()
    if "dispatch_date" in d: o.Dispatch_date = date.fromisoformat(d["dispatch_date"])
    if "description" in d:   o.Description = d["description"]
    db.session.commit()
    return ok({"message": "Order updated"})

@app.route("/orders/<oid>", methods=["DELETE"])
def delete_order(oid):
    o = Order.query.get_or_404(oid)
    db.session.delete(o)
    db.session.commit()
    return ok({"message": "Order deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# ORDER LINE ITEMS  ── Full CRUD
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/orders/<oid>/items", methods=["GET"])
def get_order_items(oid):
    items = OrderLineItem.query.filter_by(Order_id=oid).all()
    return ok([{"order_id": i.Order_id, "product_id": i.Product_id,
                "required_length": i.Required_length, "negotiated_price": i.Negotiated_price,
                "quantity": i.Quantity} for i in items])

@app.route("/orders/<oid>/items", methods=["POST"])
def create_order_item(oid):
    d = request.get_json()
    if not all(k in d for k in ["product_id", "required_length", "negotiated_price", "quantity"]):
        return err("Missing fields: product_id, required_length, negotiated_price, quantity")
    if d["required_length"] not in [40, 45, 50, 55]:
        return err("required_length must be one of: 40, 45, 50, 55")
    i = OrderLineItem(Order_id=oid, Product_id=d["product_id"],
                      Required_length=d["required_length"], Negotiated_price=d["negotiated_price"],
                      Quantity=d["quantity"])
    db.session.add(i)
    db.session.commit()
    return ok({"message": "Order line item created"}, 201)

@app.route("/orders/<oid>/items/<pid>", methods=["PUT"])
def update_order_item(oid, pid):
    i = OrderLineItem.query.get_or_404((oid, pid))
    d = request.get_json()
    if "required_length" in d:  i.Required_length  = d["required_length"]
    if "negotiated_price" in d: i.Negotiated_price = d["negotiated_price"]
    if "quantity" in d:         i.Quantity         = d["quantity"]
    db.session.commit()
    return ok({"message": "Order line item updated"})

@app.route("/orders/<oid>/items/<pid>", methods=["DELETE"])
def delete_order_item(oid, pid):
    i = OrderLineItem.query.get_or_404((oid, pid))
    db.session.delete(i)
    db.session.commit()
    return ok({"message": "Order line item deleted"})


# ══════════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)