from flask import Blueprint, jsonify, request, redirect, url_for, session

auth_bp = Blueprint('auth', __name__)


# DEBUG Route
# @auth_bp.route('/route1', methods=['GET'])
# def route1():
#     # Your code here
#     return jsonify({'status': True}), 200

@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    """Logout route."""

    if not session.get("username", None):
        return redirect(url_for("main_route"))

    session.pop('username')
    response = redirect(url_for("main_route"))
    return response

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login route."""

    # If the user already logged in, redirect him to the main page.
    if session.get("username", None):
        return redirect(url_for("main_route"))

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400

    username = data.get("username")
    password = data.get("password")
    state, code = AUTH.valid_login(username, password)

    if not state:
        return jsonify({"message": "Not registered" if not code else "Incorrect password"}), 400

    session['username'] = username
    response = jsonify({"username": username, "message": "logged in"})
    return response


@auth_bp.route("/deregister", methods=["POST"])
def deluser():
    """Del user."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "missing parameters"}), 400
    email = data.get("email")
    if not email:
        return jsonify({"message": "email missing"}), 400
    try:
        AUTH.deregister_user(email)
        session.pop('username', None)
        return jsonify({"email": email, "message": "Deleted"})
    except ValueError:
        return jsonify({"message": "something went wrong"}), 400


@auth_bp.route("/register", methods=["POST"])
def users():
    """New user."""
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    try:
        AUTH.register_user(email, username, password)
        return jsonify({"email": email, "message": "user created"})
    except ValueError:
        return jsonify({"message": "email already registered"}), 400

def init_auth_routes(auth):
    global AUTH
    AUTH = auth
