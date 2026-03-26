from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId



app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydb"

mongo = PyMongo(app)

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

if __name__ == "__main__":
	# app.register_blueprint()
	app.run(debug=True)