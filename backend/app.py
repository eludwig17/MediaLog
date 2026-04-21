
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId
from scripts import ScrapWiki
from database.db_api import DBAPI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db = DBAPI(app)

@app.route("/")
def home():
	return "Hello, world!"

@app.route("/health")
def health():
	return {"status": "ok"} 

@app.route("/books/import", methods=["GET", "POST"])
def import_book():
    url = request.args.get("url") or (request.get_json() or {}).get("url")
    if not url:
        return jsonify({"error": "Missing 'url' parameter"}), 400

    try:
        result = ScrapWiki(url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 422

    book = result["book"]

    for author in result["authors"]:
        if not db.GetAuthorByID(author["authorID"]):
            db.InsertAuthor(
                author["authorID"],
                author["firstName"],
                author["lastName"],
                author["middleName"],
                author["dateOfBirth"],
                author["homeTown"],
                author["country"],
            )

    for publisher in result["publishers"]:
        if not db.GetPublisherByUID(publisher["publisherUID"]):
            db.InsertPublisher(
                publisher["publisherUID"],
                publisher["name"],
                publisher["location"],
            )

    db.InsertBook(
        book["isbn"],
        book["title"],
        book["authorIDs"],
        book["publishYear"],
        book["publisherUIDs"],
        book["locale"],
        book["genres"],
    )

    return jsonify(result), 201

@app.route("/api/books", methods=["GET"])
def get_books():
    books = db.GetBooks()
    for book in books:
        book["_id"] = str(book["_id"])
    return jsonify(books), 200


if __name__ == "__main__":
	# app.register_blueprint()
	app.run(debug=True)