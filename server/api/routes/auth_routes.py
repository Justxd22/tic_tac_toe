from flask import Blueprint, jsonify, request, session

auth_bp = Blueprint('auth', __name__)


# DEBUG Route
# @auth_bp.route('/route1', methods=['GET'])
# def route1():
#     # Your code here
#     return jsonify({'status': True}), 200

@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    """Logout route."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    username = session.pop('username', None)
    response = jsonify({"username": username, "message": "logged out"})
    return response

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login route."""

    if 'username' in session:
        return jsonify({"message": "Already logged in"}), 200

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
    user = session.get('username', None)
    try:
        msg = AUTH.deregister_user(user)
        session.pop('username', None)
        return jsonify({"username": user, "message": msg})
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


@auth_bp.route("/register", methods=["POST"])
def users():
    """New user."""

    if 'username' in session:
        return jsonify({"message": "Already logged in"}), 200
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    try:
        AUTH.register_user(email, username, password)
        return jsonify({"email": email, "message": "user created"})
    except ValueError as err:
        return jsonify({"message": str(err)}), 400
        
@auth_bp.route("/api/auth/check-session", methods=["GET"])
def check_session():
    """Check session status."""
    if 'username' in session:
        return jsonify({"message": True}), 200
    else:
        return jsonify({"message": False}), 400

def init_auth_routes(auth):
    global AUTH
    AUTH = auth
