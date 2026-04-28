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
            book["title"],
            book["authorIDs"],
            book["publishYear"],
            book["publisherUIDs"],
            book["locale"],
            book.get("genres", []))
        return jsonify({"success": True, "result": result}),201

    @library.route("/api/books", methods=["GET"])
    def get_books():
        books = db.GetBooks()
        for book in books:
            book["_id"] = str(book["_id"])
        return jsonify(books), 200

    @library.route("/api/books/<isbn>", methods=["PUT"])
    def update_book(isbn):
        updates = request.get_json()
        # will try to use the isbn first, if nothing is there then falls back on _id due to wiki scrape
        result = db.mongo.db.books.update_one({"isbn": isbn}, {"$set": updates})
        if result.matched_count == 0:
            from bson import ObjectId
            try:
                db.mongo.db.books.update_one({"_id": ObjectId(isbn)}, {"$set": updates})
            except Exception:
                return jsonify({"error": "Book not found"}), 404
        return jsonify({"success": True}), 200

    @library.route("/api/books/<isbn>", methods=["DELETE"])
    def delete_book(isbn):
        db.mongo.db.books.delete_one({"isbn": isbn})
        return jsonify({"success": True}), 200

    @library.route("/api/authors", methods=["GET"])
    def get_authors():
        authors = db.GetAuthors()
        for author in authors:
            author["_id"] = str(author["_id"])
        return jsonify(authors), 200
    
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

    @library.route("/api/publishers", methods=["GET"])
    def get_publishers():
        publishers = db.GetPublishers()
        for pub in publishers:
            pub["_id"] = str(pub["_id"])
        return jsonify(publishers), 200

    @library.route("/api/publishers/add", methods=['POST'])
    def addpublisher():
        publisher = request.get_json()
        result = db.InsertPublisher(
            publisher["publisherUIDs"],
            publisher["name"],
            publisher["location"])
        return jsonify({"success":True, "result": result}), 201
