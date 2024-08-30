"""This to implement user routes"""
from flask import Blueprint, jsonify, request, session

user_bp = Blueprint('user', __name__)

# DEBUG Route
# @user_bp.route('/route1', methods=['GET'])
# def route1():
#     # Your code here
#     return jsonify({'status': True}), 200

@user_bp.route("/profile", methods=["GET"])
def get_user_info():
    """Retrieve user info."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    username = session.get('username')
    user_info = USER.get_info(username)
    return jsonify(user_info), 200

@user_bp.route("/profile", methods=["PUT"])
def update_user_info():
    """Update user info."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"message": "missing parameters"}), 400

    username = session.get('username')
    new_username = data.get("new_username", None)
    new_email = data.get("new_email", None)
    errors = list()

    if new_username:
        try:
            new_username = USER.update_username(username, new_username)
            session['username'] = new_username
        except ValueError as e:
            errors.append(str(e))

    if new_email:
        try:
            new_email = USER.update_email(username, new_email)
        except ValueError as e:
            errors.append(str(e))

    if errors:
        return jsonify({"message": errors}), 400

    return jsonify({"message": "user info updated"}), 200

@user_bp.route("/update_password", methods=["POST"])
def update_password():
    """Update password."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400

    username = session.get('username')
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    try:
        USER.update_password(username, old_password, new_password)
        return jsonify({"message": "password updated"})
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


@user_bp.route("/update_wins", methods=["POST"])
def update_wins():
    """Update wins."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400
    
    username = session.get('username')
    try:
        USER.increment_wins(username)
        return jsonify({"message": "wins updated"})
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


@user_bp.route("/update_losses", methods=["POST"])
def update_losses():
    """Update losses."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400
    
    username = session.get('username')
    try:
        USER.increment_losses(username)
        return jsonify({"message": "losses updated"})
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    

@user_bp.route("/update_draws", methods=["POST"])
def update_draws():
    """Update draws."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400
    
    username = session.get('username')
    try:
        USER.increment_draws(username)
        return jsonify({"message": "draws updated"})
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

@user_bp.route("/update_data", methods=["POST"])
def update_data():
    """Update draws."""
    if 'username' not in session:
        return jsonify({"message": "Not logged in"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"message": "missing parameters"}), 400
    print("DATTAA\n\n\n", data)
    win = data.get('wins', None)
    lose = data.get('losses', None)
    draw = data.get('draws', None)

    username = session.get('username')
    try:
        if win:
            USER.increment_wins(username)
        elif lose:
            USER.increment_losses(username)
        elif draw:
            USER.increment_draws(username)

        return jsonify({"message": "data updated"})
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# @user_bp.route("/user_avatar", methods=["PUT"])
# def update_user_avatar():
#     """Update user avatar, by uploading its image to the server."""
#     # will be implemented in the future
#     pass

# @user_bp.route("/user_avatar", methods=["DELETE"])
# def delete_user_avatar():
#     """Delete user avatar."""
#     # will be implemented in the future
#     pass


def init_user_routes(user):
    global USER
    USER = user
