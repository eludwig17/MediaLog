# import DBAPI from "../database"
from flask import Blueprint, request, jsonify
library = Blueprint("library", __name__)

def register(db):

    @library.route("/api/books/<int:isbn>")
    def getbooks(isbn):
        data = db.GetBookByISBN(isbn)
        return jsonify(data),200
    
    @library.route("/api/books/add", methods=['POST'])
    def add_book():
        book = request.get_json()
        result = db.InsertBook(
            book["isbn"],
            book["Title"],
            book["AuthorUID"],
            book["PublishYear"],
            book["PublishUID"],
            book["Locale"])
        return jsonify({"success": True, "result": result}),201

    @library.route("/api/books", methods=["GET"])
    def get_books():
        books = db.GetBooks()
        for book in books:
            book["_id"] = str(book["_id"])
        return jsonify(books), 200
    
    @library.route("/api/authors/<int:uid>")
    def getauthors(uid):
        data = db.GetAuthorByID(uid)
        return jsonify(data),200
    
    @library.route("/api/authors/add", methods=['POST'])
    def addauthor():
        author = request.get_json()
        result = db.InsertAuthor(
            author["AuthorUID"],
            author["FirstName"],
            author["MiddleName"],
            author["LastName"],
            author["DateOfBirth"],
            author["Hometown"],
            author["Country"])
        return jsonify({"sucess":True, "result": result}), 201

    @library.route("/api/publishers")
    def getpublisher():
       publishers = db.getpublisher()
       return jsonify(publishers),200

    @library.route("/api/publishers/add", methods=['POST'])
    def addpublisher():
        publisher = request.get_json()
        result = db.InsertPublisher(
            publisher["publisherUIDs"],
            publisher["name"],
            publisher["location"])
        return jsonify({"success":True, "result": result}), 201
