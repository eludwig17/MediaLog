from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

load_dotenv()

class DBAPI:
    def __init__(self, app) -> None:
        address = os.getenv("MONGO_ADDRESS", "localhost")
        port = os.getenv("MONGO_PORT", "27017")
        database = os.getenv("MONGO_DATABASE", "my_database")

        app.config["MONGO_URI"] = f"mongodb://{address}:{port}/{database}"
        self.mongo = PyMongo(app)

    def InsertBook(self, isbn, title, authorIDs, publishYear, publisherUIDs, locale, genres=[]) -> bool:
        try:
            self.mongo.db.books.insert_one(
            {
                "isbn": isbn,
                "title": title,
                "authorIDs": authorIDs,
                "publishYear": publishYear,
                "publisherUIDs": publisherUIDs,
                "locale": locale,
                "genres": genres,
            })
            return True
        except Exception as e:
            print(f"Error inserting book: {e}")
            return False

    def GetBooks(self, limit: int = 10) -> list:
        return list(self.mongo.db.books.find().limit(limit))
    
    def GetBookByISBN(self, isbn) -> dict:
        return self.mongo.db.books.find_one({"isbn": isbn})

    def InsertAuthor(self, authorID, firstName, lastName, 
                     middleName = "", 
                     dateOfBirth = "", 
                     homeTown = "", 
                     country = "") -> bool:
        try:
            self.mongo.db.authors.insert_one(
            {
                "authorID": authorID,
                "firstName": firstName,
                "lastName": lastName,
                "middleName": middleName,
                "dateOfBirth": dateOfBirth,
                "homeTown": homeTown,
                "country": country
            })
            return True
        except Exception as e:
            print(f"Error inserting author: {e}")
            return False
        
    def GetAuthors(self, limit: int = 10) -> list:
        return list(self.mongo.db.authors.find().limit(limit))
    
    def GetAuthorByID(self, authorID) -> dict:
        return self.mongo.db.authors.find_one({"authorID": authorID})
    
    def InsertPublisher(self, publisherUID, name, location) -> bool:
        try:
            self.mongo.db.publishers.insert_one(
            {
                "publisherUID": publisherUID,
                "name": name,
                "location": location
            })
            return True
        except Exception as e:
            print(f"Error inserting publisher: {e}")
            return False
        
    def GetPublishers(self, limit: int = 10) -> list:
        return list(self.mongo.db.publishers.find().limit(limit))

    def GetPublisherByUID(self, publisherUID) -> dict:
        return self.mongo.db.publishers.find_one({"publisherUID": publisherUID})