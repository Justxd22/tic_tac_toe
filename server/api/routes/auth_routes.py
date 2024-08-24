from flask import Blueprint, jsonify, request, abort, redirect, url_for, g, session

auth_bp = Blueprint('auth', __name__)


# DEBUG Route
# @auth_bp.route('/route1', methods=['GET'])
# def route1():
#     # Your code here
#     return jsonify({'status': True}), 200


@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    """Logout route."""

    if not session.get("session_id", None):
        return redirect(url_for("/"))

    session.pop('username')
    response = redirect(url_for("/"))
    return response

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login route."""

    # If the user already logged in, redirect him to the main page.
    if session.get("session_id", None):
        return redirect(url_for("/"))

    data = request.json
    username = data.get("username")
    password = data.get("password")
    state, code = g.AUTH.valid_login(username, password)

    if not state:
        return jsonify({"message": "Not registered" if not code else "Incorrect password"}), 400

    g.AUTH.create_session(username)
    response = jsonify({"username": username, "message": "logged in"})
    return response


@auth_bp.route("/deregister", methods=["POST"])
def deluser():
    """Del user."""
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"message": "email missing"}), 400
    try:
        g.AUTH.deregister_user(email)
        return jsonify({"email": email, "message": "Deleted"})
    except ValueError:
        return jsonify({"message": "something went wrong"}), 400


@auth_bp.route("/register", methods=["POST"])
def users():
    """New user."""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    try:
        g.AUTH.register_user(email, username, password)
        return jsonify({"email": email, "message": "user created"})
    except ValueError:
        return jsonify({"message": "email already registered"}), 400
