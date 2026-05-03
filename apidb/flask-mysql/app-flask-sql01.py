from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow.sqla import SQLAlchemyAutoSchema
from marshmallow import fields



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1943-me@localhost:3306/testDB'
db = SQLAlchemy(app)







class Authors(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(28))
    specialisation = db.Column(db.String(50))
    def create(self):
        db.session.add(self)
        db.session.commit()
        return self
    def __init__(self, name, specialisation):
        self.name = name
        self.specialisation = specialisation
    def __repr__(self):
        return 'Author %r' % self.id

with app.app_context():
    db.create_all()
    
    
class AuthorSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Authors
        sqla_session = db.session
    id = fields.Int(dump_only=True)
    name = fields.String(required=True)
    specialisation = fields.String(required=True)
    
 

 
 
#curl http://localhost:5000/authors  
@app.route('/authors', methods=['GET'])
def get_authors():
    get_authors = Authors.query.all()
    author_schema = AuthorSchema(many=True)
    authors = author_schema.dump(get_authors)
    return make_response(jsonify({"authors": authors}))


#Route to retrieve an author by ID
@app.route('/author/<int:id>', methods=['GET'])
def get_author(id):
    author = Authors.query.get(id)
    if author: 
        author_schema = AuthorSchema()
        author_json = author_schema.dump(author)
        return jsonify({"author": author_json}), 200
    else:
        return jsonify({"message": "Author not found"}),404


# Route to handle POST request for creating new authors
# curl --header "Content-Type:application/json" --request POST --data "{\"name\": \"Author C\", \"specialisation\":\"C++\"}" -v http://127.0.0.1:5000/authors
@app.route('/authors', methods = ['GET', 'POST'])
def create_author():
    # Parse JSON data from the request
    author_data= request.json
    # Validate and deserialize JSON data using AuthorSchema
    try:
        new_author_data = AuthorSchema().load(author_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    new_author=Authors(**new_author_data)
    try: 
        db.session.add(new_author)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)})

    

    
    author_schema= AuthorSchema()
    author_json= author_schema.dump(new_author)
    return jsonify(author_json), 201

# curl --header "Content-Type:application/json" --request PUT --data "{\"name\": \"Author P\", \"specialisation\":\"P++\"}" -v http://127.0.0.1:5000/author/1
@app.route('/author/<int:id>', methods=['PUT'])
def update_author(id):
    author = Authors.query.get(id)
    if author:
        data = request.get_json()
        author.name = data.get('name', author.name)
        author.specialisation = data.get('specialisation', author.specialisation)
        db.session.commit()
        return jsonify({"message": "Author updated successfully"}), 200
    else:
        return jsonify({"message": "Author not found"}), 404


# curl -X DELETE http://127.0.0.1:5000/author/1
@app.route('/author/<int:id>', methods=['DELETE'])
def delete_author(id):
    author = Authors.query.get(id)
    if author:
        db.session.delete(author)
        db.session.commit()
        return jsonify({"message": "Author deleted successfully"}), 200
    else:
        return jsonify({"message": "Author not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)