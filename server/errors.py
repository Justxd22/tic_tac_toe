"""All error codes here."""
from flask import Blueprint, jsonify

error = Blueprint('errors', __name__)

@error.errorhandler(404)
def not_found(error):
    """Not found handler."""
    return jsonify({"error": "Not found"}), 404


@error.errorhandler(500)
def internal_server_error(error):
    """Handler for 500 Internal Server Error."""
    return jsonify({"error": "Internal Server Error"}), 500


@error.errorhandler(401)
def unauthorized(error) -> str:
    """Unauthorized handler."""
    return jsonify({"error": "UnauthorizedDD"}), 401


@error.errorhandler(403)
def forbidden(error) -> str:
    """Forbidden handler."""
    return jsonify({"error": "Forbidden"}), 403
