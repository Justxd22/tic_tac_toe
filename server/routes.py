"""Most routes here."""
from flask import Blueprint, jsonify

api = Blueprint('api', __name__, url_prefix="/api")
VERSION = '1.0'

@api.route('/status')
def status():
    data = {
        "status": "ok",
        "ver": VERSION
    }
    return jsonify(data)

