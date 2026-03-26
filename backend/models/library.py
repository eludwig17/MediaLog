import DbApi from "../models"
class Library:

    @app.route("/api/books")
    def getbooks(self):
        data = DbApi.Query("SELECT * FROM books")
        return jsonify(data, 201)