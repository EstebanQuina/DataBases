from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow.sqla import SQLAlchemyAutoSchema
from marshmallow import fields

app=Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:1943-me@localhost:3306/testDB'

db = SQLAlchemy(app)

class Author(db.Model): 

    tablename = 'author' 

    id = db.Column(db.Integer, primary_key=True) 

    name = db.Column(db.String(100), nullable=False) 

    #The relationship helper (not a real column in MySQL) 

    books = db.relationship('Book', backref='author', lazy=True) 
 

class Book(db.Model): 

    tablename = 'books' 

    id = db.Column(db.Integer, primary_key=True) 

    title = db.Column(db.String(200), nullable=False) 

    genre = db.Column(db.String(50)) 

    author_id = db.Column(db.Integer, db.ForeignKey('author.id'), nullable=False) 

class AuthorSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Author
        sqla_session = db.session 
    
    id = fields.Integer(dump_only = True)
    name = fields.String(required =True)

class BookSchema(SQLAlchemyAutoSchema):
    class Meta(SQLAlchemyAutoSchema.Meta):
        model = Book
        sqla_session = db.session 
    
    id = fields.Integer(dump_only = True)
    title = fields.String(required =True)
    genre= fields.String(required=True)
    author_id=fields.Integer(required=True)

#get authors ]
# curl -v http://127.0.0.1:5000/authors

@app.route('/authors', methods = ['GET'])
def authors():
    get_authors=Author.query.all()
    authors_schema = AuthorSchema(many = True)
    authors = authors_schema.dump(get_authors)
    return make_response(jsonify({"authors": authors}))

#get_author_books
# curl -v http://127.0.0.1:5000/author/1/books
@app.route('/author/<int:id>/books', methods = ['GET'])
def get_author_books(id):
    author = Author.query.get(id)
    if author:
        books = Book.query.filter_by(author_id=author.id).all()
        books_schema = BookSchema(many = True)
        books_json = books_schema.dump(books)
        return make_response(jsonify({"books": books_json}))
    else:
        return make_response(jsonify({"message": "Author not found"}), 404)
    
#post book
# curl -X POST -H "Content-Type: application/json" -d '{"title": "Book Title", "genre": "Fiction", "author_id": 1}' http://127.0.0.1:5000/books
@app.route('/books', methods = ['POST'])
def create_book():
    book_data = request.get_json()
    try:
        new_book_data = BookSchema().load(book_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    new_book = Book(**new_book_data)
    try:
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    book_schema = BookSchema()
    book_json = book_schema.dump(new_book)
    return jsonify(book_json), 201

if __name__ == "__main__":
    app.run(debug=True)