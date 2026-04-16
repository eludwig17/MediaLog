import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "scripts"))

from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId
from ScrapWiki import ScrapWiki
from database.db_api import DBAPI



app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydb"

mongo = PyMongo(app)
db = DBAPI(app)

@app.route("/")
def home():
	return "Hello, world!"

@app.route("/health")
def health():
	return {"status": "ok"}

@app.route("/users", methods=["GET"])
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user["_id"] = str(user["_id"])  # ObjectId isn't JSON serializable
    return jsonify(users)

@app.route("/books/import", methods=["POST"])
def import_book():
    body = request.get_json()
    if not body or "url" not in body:
        return jsonify({"error": "Missing 'url' in request body"}), 400

    try:
        result = ScrapWiki(body["url"])
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


if __name__ == "__main__":
	# app.register_blueprint()
	app.run(debug=True)