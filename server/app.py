#!/usr/bin/python3
"""Simple Flask demo."""

from flask import Flask, jsonify, abort, redirect, request, url_for
from flask_cors import CORS
from error import error
from routes import api
from auth import Auth
from pymongo import MongoClient
import os

app = Flask("DEMO")
CORS(app)

app.register_blueprint(api)
app.register_blueprint(error)

db = MongoClient('mongodb://localhost:27017/')['tic_tac_toe']
AUTH = Auth(db)

@app.before_request
def have_Session():
    """Endpoints doesn't require session before using api."""
    null = [ # dont need session
        '/api/status',
        '/register',
        '/login'
    ]
    if not request.cookies.get("session_id") and not request.path in null:
        abort(403)


@app.route("/register", methods=["POST"])
def users():
    """Nnew user."""
    email = request.form.get("email")
    username = request.form.get("username")
    password = request.form.get("password")
    try:
        AUTH.register_user(email, username, password)
        return jsonify({"email": email, "message": "user created"})
    except ValueError:
        return jsonify({"message": "email already registered"}), 400

@app.route("/login", methods=["POST"])
def login():
    """Login route."""
    email = request.form.get("email")
    password = request.form.get("password")
    if not AUTH.valid_login(email, password):
        abort(401)
    session_id = AUTH.create_session(email)
    response = jsonify({"email": email, "message": "logged in"})
    response.set_cookie("session_id", session_id)
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


app.run(host="127.0.0.1", port="3000", debug=True)

