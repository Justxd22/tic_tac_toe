from flask import Blueprint, send_from_directory, redirect, url_for, session
import os

web_bp = Blueprint('web_dynamic', __name__, static_folder='../static')


@web_bp.route('/login')
def login():
    if 'username' in session:
        return redirect(url_for('web_dynamic.serve', path='/'))
    return send_from_directory(web_bp.static_folder, 'index.html')

@web_bp.route('/register')
def register():
    if 'username' in session:
        return redirect(url_for('web_dynamic.serve', path='/'))
    return send_from_directory(web_bp.static_folder, 'index.html')

@web_bp.route('/', defaults={'path': ''})
@web_bp.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(web_bp.static_folder + '/' + path):
        return send_from_directory(web_bp.static_folder, path)
    else:
        return send_from_directory(web_bp.static_folder, 'index.html')
