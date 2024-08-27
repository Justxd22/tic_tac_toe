"""This to implement user routes"""

# @app.route("/profile")
# def profile() -> str:
#     """Get User profile."""
#     session_id = request.cookies.get("session_id")
#     user = AUTH.get_user_from_session_id(session_id)
#     if not user:
#         abort(403)
#     return jsonify({"email": user.email}) # todo return full user object
