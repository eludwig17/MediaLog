import DBAPI from "../database"
class Library:

    @app.route("/api/books/<int:isbn>")
    def getbooks(isbn):
        data = DBAPI.GetBookByISBN(isbn)
        return jsonify(data),200
    @app.route("/api/books/add", methods=['POST'])
    def add_book(book):
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
    def addauthor(author):
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