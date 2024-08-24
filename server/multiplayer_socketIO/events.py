from flask_socketio import emit
from . import socketio
import random

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    emit('message', "yoooo", broadcast=True)

taken = []
@socketio.on('humanMove')
def handle_move(msg):
    print(f"Message: {msg}", taken, msg['index'])
    taken.append(msg['index'])
    x = random.randint(0, 8)
    while 1:
        if x in taken:
            x = random.randint(0, 8)
        else:
            break
    d = {
        'player': 2,
        'index': x
    }
    emit('backendAI', d, broadcast=True)

# @socketio.on('connect')
# def handle_connect():
#     print("Client connected")
#     emit('message', 'Welcome to the server!', broadcast=True)
