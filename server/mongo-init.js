// mongo-init.js

// Connect to the admin database to authenticate
db = db.getSiblingDB('admin');

// Authenticate as the root user
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

// Switch to the database we want to use
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

// Function to create collection if it doesn't exist
function createCollectionIfNotExists(collectionName, options) {
    if (!db.getCollectionNames().includes(collectionName)) {
        db.createCollection(collectionName, options);
        print(`Collection ${collectionName} created.`);
    } else {
        print(`Collection ${collectionName} already exists.`);
        // Optionally update the validator if the collection already exists
        db.runCommand({
            collMod: collectionName,
            validator: options.validator
        });
        print(`Updated validator for ${collectionName}.`);
    }
}

// Users Collection
createCollectionIfNotExists("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "email", "password", "wins", "losses", "draws", "game_played", "score", "created_at"],
            properties: {
                username: { bsonType: "string" },
                email: { bsonType: "string" },
                password: { bsonType: "string" },
                wins: { bsonType: "int" },
                losses: { bsonType: "int" },
                draws: { bsonType: "int" },
                game_played: { bsonType: "int" },
                score: { bsonType: "int" },
                created_at: { bsonType: "date" },
                avatar: { bsonType: "string" }
            }
        }
    }
});

db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "score": -1 });
db.users.createIndex({ "game_played": -1 });
db.users.createIndex({ "wins": -1 });

// Games Collection
createCollectionIfNotExists("games", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["player1", "player2", "board", "current_turn", "status", "created_at"],
            properties: {
                player1: { bsonType: "objectId" },
                player2: { bsonType: "objectId" },
                board: { bsonType: "array" },
                current_turn: { bsonType: "objectId" },
                winner: { bsonType: ["objectId", "null"] },
                is_draw: { bsonType: "bool" },
                status: { enum: ["Ongoing", "Completed"] },
                created_at: { bsonType: "date" },
                end_at: { bsonType: ["date", "null"] }
            }
        }
    }
});

db.games.createIndex({ "player1": 1 });
db.games.createIndex({ "player2": 1 });
db.games.createIndex({ "status": 1 });
db.games.createIndex({ "created_at": -1 });

// Leaderboard Collection
createCollectionIfNotExists("leaderboard", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "wins", "draws", "score"],
            properties: {
                user_id: { bsonType: "objectId" },
                wins: { bsonType: "int" },
                draws: { bsonType: "int" },
                score: { bsonType: "int" }
            }
        }
    }
});

db.leaderboard.createIndex({ "user_id": 1 }, { unique: true });
db.leaderboard.createIndex({ "score": -1 });
db.leaderboard.createIndex({ "wins": -1 });
db.leaderboard.createIndex({ "draws": -1 });

// Create a new user for this specific database (if it doesn't exist)
if (!db.getUser(process.env.MONGO_NON_ROOT_USERNAME)) {
    db.createUser({
        user: process.env.MONGO_NON_ROOT_USERNAME,
        pwd: process.env.MONGO_NON_ROOT_PASSWORD,
        roles: [
            {
                role: "readWrite",
                db: process.env.MONGO_INITDB_DATABASE
            },
        ]
    });
    print(`Created user ${process.env.MONGO_NON_ROOT_USERNAME}.`);
} else {
    print(`User ${process.env.MONGO_NON_ROOT_USERNAME} already exists.`);
}

print('MongoDB initialization completed successfully');
