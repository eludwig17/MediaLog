import DBAPI from "../database"
from flask import Flask, request, jsonify
app = Flask(__name__)
class Library:

    @app.route("/api/books/<int:isbn>")
    def getbooks(isbn):
        data = DBAPI.GetBookByISBN(isbn)
        return jsonify(data),200
    
    @app.route("/api/books/add", methods=['POST'])
    def add_book():
        book = request.get_json()
        result = DBAPI.InsertBook(
            book["isbn"],
            book["Title"],
            book["AuthorUID"],
            book["PublishYear"],
            book["PublishUID"],
            book["Locale"])
        return jsonify({"success": True, "result": result}),201
    

    
    @app.route("/api/authors/<int:uid>")
    def getauthors(uid):
        data = DBAPI.GetAuthorByID(uid)
        return jsonify(data),200
    
    @app.route("/api/authors/add", methods=['POST'])
    def addauthor():
        author = request.get_json()
        result = DBAPI.InsertAuthor(
            author["AuthorUID"],
            author["FirstName"],
            author["MiddleName"],
            author["LastName"],
            author["DateOfBirth"],
            author["Hometown"],
            author["Country"])
        return jsonify({"sucess":True, "result": result}), 201

    @app.route("/api/publishers")
    def getpublisher():
       publishers = DBAPI.getpublisher()
       return jsonify(publishers),200

    @app.route("/api/publishers/add", methods=['POST'])
    def addpublisher():
        publisher = request.get_json()
        result = DBAPI.InsertPublisher(
            publisher["publisherUIDs"],
            publisher["name"],
            publisher["location"])
        return jsonify({"success":True, "result": result}), 201
