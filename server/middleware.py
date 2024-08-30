"""
This to implement middleware related function like protect specific routes,
or check every request have valid session or not, and rate limiting
features if needed.
"""
from flask import request, session, jsonify, redirect, url_for


def auth_middleware(app):
    @app.before_request
    def check_auth():
        # Paths that don't require authentication
        open_paths = [
            url_for('web_dynamic.register'),
            url_for('web_dynamic.login'),
            url_for('auth.users'),
            url_for('auth.login'),
            url_for('web_dynamic.ttt_ai'),
            url_for('web_dynamic.tictactoe'),
            url_for('web_dynamic.home'),
            url_for('web_dynamic.status'),
            ]

        # Check if the user is logged in
        is_logged_in = 'username' in session

        # Get the current path
        current_path = request.path

        # API routes (excluding /api/auth/register and /api/auth/login)
        if current_path.startswith('/api/'):
            if current_path not in open_paths and not is_logged_in:
                return jsonify({"error": "Unauthenticated"}), 401

        # Non-API routes (excluding /register and /login)
        elif current_path not in open_paths and not is_logged_in and not current_path.startswith('/assets/'):
            return redirect(url_for('web_dynamic.login', next=request.url))
