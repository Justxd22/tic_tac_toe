from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import CollectionInvalid

def init_db(app):
    client = MongoClient(app.config['MONGO_URI'])
    db = client[app.config['MONGO_DB_NAME']]

    # Users Collection
    user_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["username", "email", "password", "wins", "losses", "draws", "game_played", "score", "created_at"],
            "properties": {
                "username": {"bsonType": "string"},
                "email": {"bsonType": "string"},
                "password": {"bsonType": "string"},
                "wins": {"bsonType": "int"},
                "losses": {"bsonType": "int"},
                "draws": {"bsonType": "int"},
                "game_played": {"bsonType": "int"},
                "score": {"bsonType": "int"},
                "created_at": {"bsonType": "date"},
                "avatar": {"bsonType": "string"}
            }
        }
    }

    try:
        db.create_collection("users", validator=user_validator)
    except CollectionInvalid:
        db.command("collMod", "users", validator=user_validator)

    users = db.users
    users.create_index([("username", ASCENDING)], unique=True)
    users.create_index([("email", ASCENDING)], unique=True)
    users.create_index([("score", DESCENDING)])
    users.create_index([("game_played", DESCENDING)])
    users.create_index([("wins", DESCENDING)])

    # Games Collection
    game_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["player1", "player2", "board", "current_turn", "status", "created_at"],
            "properties": {
                "player1": {"bsonType": "objectId"},
                "player2": {"bsonType": "objectId"},
                "board": {"bsonType": "array"},
                "current_turn": {"bsonType": "objectId"},
                "winner": {"bsonType": ["objectId", "null"]},
                "is_draw": {"bsonType": "bool"},
                "status": {"enum": ["Ongoing", "Completed"]},
                "created_at": {"bsonType": "date"},
                "end_at": {"bsonType": ["date", "null"]}
            }
        }
    }

    try:
        db.create_collection("games", validator=game_validator)
    except CollectionInvalid:
        db.command("collMod", "games", validator=game_validator)

    games = db.games
    games.create_index([("player1", ASCENDING)])
    games.create_index([("player2", ASCENDING)])
    games.create_index([("status", ASCENDING)])
    games.create_index([("created_at", DESCENDING)])

    # Session Collection
    session_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["session_id", "username", "created_at"],
            "properties": {
                "session_id": {"bsonType": "string"},
                "username": {"bsonType": "string"},
                "created_at": {"bsonType": "date"}
            }
        }
    }

    try:
        db.create_collection("sessions", validator=session_validator)
    except CollectionInvalid:
        db.command("collMod", "sessions", validator=session_validator)

    sessions = db.sessions
    sessions.create_index([("session_id", ASCENDING)], unique=True)
    sessions.create_index([("username", ASCENDING)])
    sessions.create_index([("created_at", DESCENDING)])

    # Leaderboard Collection (Optional)
    leaderboard_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["user_id", "wins", "draws", "score"],
            "properties": {
                "user_id": {"bsonType": "objectId"},
                "wins": {"bsonType": "int"},
                "draws": {"bsonType": "int"},
                "score": {"bsonType": "int"}
            }
        }
    }

    try:
        db.create_collection("leaderboard", validator=leaderboard_validator)
    except CollectionInvalid:
        db.command("collMod", "leaderboard", validator=leaderboard_validator)

    leaderboard = db.leaderboard
    leaderboard.create_index([("user_id", ASCENDING)], unique=True)
    leaderboard.create_index([("score", DESCENDING)])
    leaderboard.create_index([("wins", DESCENDING)])
    leaderboard.create_index([("draws", DESCENDING)])

    print("Database initialized successfully")

    return db
