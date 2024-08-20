#!/usr/bin/python3
"""Simple Flask demo."""

from flask import Flask, jsonify, abort, request
from flask_cors import CORS
import os

app = Flask("DEMO")
CORS(app)

@app.errorhandler(404)
def not_found(error) -> str:
    """Not found handler."""
    return jsonify({"error": "Not found"}), 404



@app.route('/')
def home():
    return 'Hello world'

@app.route('/DEMOOO')
def demo():
    data = {
        "status": "ok",
        "msg": "Hellllo WORLDD"
    }
    return jsonify(data)


app.run(host="127.0.0.1", port="3000")

