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

    def InsertBook(self, isbn, title, authorID, publishYear, publisherUID, locale) -> bool:
        try:
            self.mongo.db.books.insert_one(
            {
                "isbn": isbn,
                "title": title,
                "authorID": authorID,
                "publishYear": publishYear,
                "publisherUID": publisherUID,
                "locale": locale
            })
            return True
        except Exception as e:
            print(f"Error inserting book: {e}")
            return False

    def GetBooks(self) -> list:
        return list(self.mongo.db.books.find())
    
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
        
    def GetAuthors(self) -> list:
        return list(self.mongo.db.authors.find())
    
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
        
    def GetPublishers(self) -> list:
        return list(self.mongo.db.publishers.find())