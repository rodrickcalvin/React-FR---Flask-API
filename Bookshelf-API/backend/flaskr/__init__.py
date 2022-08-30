import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy  # , or_
from flask_cors import CORS
import random

from decorators.paginate import paginate_books
from models import setup_db, Book



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    # CORS Headers
    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response


    @app.route('/books')
    def get_all_books():
        books = Book.query.order_by(Book.id).all()
        paged_books = paginate_books(request, books)
        return jsonify({
            'success': True,
            'books': paged_books,
            'total_books': len(books)
        })


    @app.route('/books/<int:book_id>', methods=['PATCH'])
    def update_book_rating(book_id):
        body = request.get_json()
        try:
            rating = body.get('rating')
            book = Book.query.filter(Book.id == book_id).one_or_none()

            if book is None:
                abort(404)

            book.rating = rating
            book.update()

            return jsonify({
                'success': True,
                'id': book.id
            })
        except:
            abort(400)


    @app.route('/books/<int:book_id>', methods=['DELETE'])
    def delete_book(book_id):
        try:
            book = Book.query.filter(Book.id == book_id).one_or_none()

            if book is None:
                abort(404)

            book.delete()

            return jsonify({
                'success': True,
                'deleted': book_id,
                'books': [book.format() for book in Book.query.all()],
                'total_books': len(Book.query.all())
            })
        except:
            abort(422)


    @app.route('/books', methods=['POST'])
    def create_book():
        body = request.get_json()
        title = body.get('title', None)
        author = body.get('author', None)
        rating = body.get('rating', None)
        search = body.get("search", None)

        try:
            if search:
                searched_books = Book.query.order_by(Book.id).filter(
                    Book.title.ilike("%{}%".format(search))
                )
                current_books = paginate_books(request, searched_books)

                return jsonify(
                    {
                        "success": True,
                        "books": current_books,
                        "total_books": len(searched_books.all()),
                    }
                )

            else:
                book = Book(title=title, author=author, rating=rating)
                book.insert()

                books = Book.query.order_by(Book.id).all()
                paged_books = paginate_books(request, books)

                return jsonify({
                    'success': True,
                    'created': book.id,
                    'books': paged_books,
                    'total_books': len(books)
                })
        except:
            abort(422)

    
    
    # Error Handling:
    @app.errorhandler(404)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 404, "message": "resource not found"}),
            404,
        )

    @app.errorhandler(422)
    def unprocessable(error):
        return (
            jsonify({"success": False, "error": 422, "message": "unprocessable"}),
            422,
        )

    @app.errorhandler(400)
    def bad_request(error):
        return (
            jsonify({"success": False, "error": 400, "message": "bad request"}), 
            400
        )


    @app.errorhandler(405)
    def not_found(error):
        return (
            jsonify({"success": False, "error": 405, "message": "method not allowed"}),
            405
        )
    
    
    return app
