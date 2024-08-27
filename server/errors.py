"""Module for handling error codes in the application."""
from flask import Blueprint, jsonify, Response

error = Blueprint('errors', __name__)

@error.errorhandler(404)
def not_found(error) -> Response:
    """
    Handle 404 errors.

    Args:
        error: The error object.

    Returns:
        A JSON response with the error message and the HTTP status code.
    """
    return jsonify({"error": "Not found"}), 404


@error.errorhandler(500)
def internal_server_error(error) -> Response:
    """
    Handle 500 errors.

    Args:
        error: The error object.

    Returns:
        A JSON response with the error message and the HTTP status code.
    """
    return jsonify({"error": "Internal Server Error"}), 500


@error.errorhandler(401)
def unauthorized(error) -> Response:
    """
    Handle 401 errors.

    Args:
        error: The error object.

    Returns:
        A JSON response with the error message and the HTTP status code.
    """
    return jsonify({"error": "Unauthorized"}), 401


@error.errorhandler(403)
def forbidden(error) -> Response:
    """
    Handle 403 errors.

    Args:
        error: The error object.

    Returns:
        A JSON response with the error message and the HTTP status code.
    """
    return jsonify({"error": "Forbidden"}), 403
