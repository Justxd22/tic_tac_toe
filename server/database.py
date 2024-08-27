from pymongo import MongoClient

def init_db(app):
    client = MongoClient(app.config['MONGO_URI'])
    db = client[app.config['MONGO_DB_NAME']]

    print("Database initialized successfully")

    return db
