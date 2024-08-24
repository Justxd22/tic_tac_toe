from flask_socketio import SocketIO

# Initialize SocketIO
socketio = SocketIO()

# Import the events
from . import events
