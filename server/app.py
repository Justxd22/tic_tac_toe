#!/usr/bin/python3
"""Simple Flask demo."""

from flask import Flask, jsonify, abort, redirect, request, url_for
from flask_cors import CORS
from error import error
from routes import api
from auth import Auth
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
import os, random, time

app = Flask("DEMO")
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


app.register_blueprint(api)
app.register_blueprint(error)
socketio = SocketIO(app, cors_allowed_origins="*")
load_dotenv()

database_url = os.getenv('DATABASE_URL', 'mongodb://localhost:27017/')
client = MongoClient(database_url)
db = client['tic_tac_toe']

AUTH = Auth(db)

@app.before_request
def have_Session():
    """Endpoints doesn't require session before using api."""
    null = [ # dont need session
        '/api/status',
        '/register',
        '/deregister', # remove this (user deletion require auth) here for debug
        '/login'
    ]
    if not request.cookies.get("session_id") and not request.path in null:
        abort(403)


@app.route("/register", methods=["POST"])
def users():
    """Nnew user."""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    try:
        AUTH.register_user(email, username, password)
        return jsonify({"email": email, "message": "user created"})
    except ValueError:
        return jsonify({"message": "email already registered"}), 400


@app.route("/deregister", methods=["POST"])
def deluser():
    """Del user."""
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"message": "email missing"}), 400
    try:
        AUTH.deregister_user(email)
        return jsonify({"email": email, "message": "Deleted"})
    except ValueError:
        return jsonify({"message": "something went wrong"}), 400


@app.route("/login", methods=["POST"])
def login():
    """Login route."""
    data = request.json
    username = data.get("username")
    password = data.get("password")
    state, code = AUTH.valid_login(username, password)
    if not state:
        return jsonify({"message": "Not registered" if not code else "Incorrect password"}), 400
    session_id = AUTH.create_session(username)
    print(session_id)
    response = jsonify({"username": username, "message": "logged in"})
    response.set_cookie('session_id', session_id, path='/', samesite='None', secure=True, domain="", expires=time.time() + 99999999)
    return response


@app.route("/login", methods=["DELETE"])
def logout():
    """Logout route."""
    session_id = request.cookies.get("session_id")
    user = AUTH.get_user_from_session_id(session_id)
    if not user:
        abort(403)
    AUTH.destroy_session(user.id)
    return redirect(url_for("/"))


@app.route('/check-session', methods=['GET'])
def check_session():
    session_id = request.cookies.get("session_id")
    print("CHEC", session_id)
    user = AUTH.get_user_from_session_id(session_id)
    if user:
        return jsonify(loggedIn=True), 200
    else:
        return jsonify(loggedIn=False), 403


@app.route("/profile")
def profile() -> str:
    """Get User profile."""
    session_id = request.cookies.get("session_id")
    user = AUTH.get_user_from_session_id(session_id)
    if not user:
        abort(403)
    return jsonify({"email": user.email}) # todo return full user object

@app.route('/')
def home():
    return 'Hello world'

@app.route('/DEMOOO')
def demo():
    data = {
        "status": "ok",
        "msg": "Hellllo WORLDD"
    }
    return jsonify(data)


@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    emit('message', "yoooo", broadcast=True)


# @socketio.on('humanMove')
# def handle_message(msg):
#     print(f"Message: {msg}", msg['index'])
#     x = random.randint(0, 8)
#     d = {
#         'player': 2,
#         'index': x
#     }
#     emit('backendAI', d, broadcast=True)

waiting_players = []
games = {}

@socketio.on('join_queue')
def join_queue():
    session_id = request.cookies.get("session_id")
    print('session', session_id, games, waiting_players)
    if session_id not in waiting_players:
        waiting_players.append(session_id)
        emit('game_id', session_id)
        
    
    if len(waiting_players) >= 2:
        player1 = waiting_players.pop(0)
        player2 = waiting_players.pop(0)
        game_id = f"{player1}_{player2}"
        games[game_id] = {'player1': player1, 'player2': player2, 'grid': [None] * 9}
        
        emit('start_game', {'game_id': game_id, 'player': 1}, room=player1)
        emit('start_game', {'game_id': game_id, 'player': 2}, room=player2)
        print('EMITTTTTTT\n\n\n\n\n\n', games[game_id], game_id)

@socketio.on('humanMove')
def handle_human_move(data):
    session_id = request.cookies.get("session_id")
    print('HUMANNNNNmv', session_id, data)
    game_id = data['game_id']
    game = games.get(game_id)

    if not game:
        return

    if session_id == game['player1']:
        opponent = game['player2']
        player = 1
    else:
        opponent = game['player1']
        player = 2

    index = data['index']
    if game['grid'][index] is None:
        game['grid'][index] = player
        emit('move', {'index': index, 'player': player}, room=opponent)

# app.run(host="127.0.0.1", port="3000", debug=True)
socketio.run(app, host="127.0.0.1", port=3000, debug=True)
