from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1943-me@localhost:3306/testDB'

db = SQLAlchemy(app)


class Authors(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    specialisation = db.Column(db.String(50))

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def __init__(self, name, specialisation):
        self.name = name
        self.specialisation = specialisation

    def __repr__(self):
        return '<Author %d>' % self.id
with app.app_context():
    db.create_all()

#curl -v http://127.0.0.1:5000/authors
@app.route('/authors', methods = ['GET'])
def authors():
    get_authors = Authors.query.all()
    return jsonify(get_authors)

if __name__ == "__main__":
    app.run(debug=True)
