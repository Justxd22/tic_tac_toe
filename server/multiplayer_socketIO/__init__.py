from flask_socketio import SocketIO

# Initialize SocketIO with async_mode set to 'eventlet'
socketio = SocketIO(async_mode='eventlet')

# Import the events
from . import events
