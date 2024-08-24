from flask import Blueprint, jsonify, request, abort, redirect, url_for, g

auth_bp = Blueprint('auth', __name__)


# DEBUG Route
# @auth_bp.route('/route1', methods=['GET'])
# def route1():
#     # Your code here
#     return jsonify({'status': True}), 200


@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    """Logout route."""
    session_id = request.cookies.get("session_id")
    user = g.AUTH.get_user_from_session_id(session_id)
    if not user:
        abort(403)
    g.AUTH.destroy_session(user.id)
    response = redirect(url_for("/"))
    response.delete_cookie("session_id")
    return response

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login route."""

    # If the user already logged in, redirect him to the main page.
    if request.cookies.get("session_id"):
        return redirect(url_for("/"))

    data = request.json
    username = data.get("username")
    password = data.get("password")
    state, code = g.AUTH.valid_login(username, password)
    if not state:
        return jsonify({"message": "Not registered" if not code else "Incorrect password"}), 400
    session_id = g.AUTH.create_session(username)
    print(session_id)
    response = jsonify({"username": username, "message": "logged in"})
    response.set_cookie("session_id", session_id)
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
