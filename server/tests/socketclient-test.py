# Import the socketio and random libraries
import socketio
import random

# Create a Socket.IO client
sio = socketio.Client()

# Define an event handler for the 'connect' event
# This event is automatically emitted when the client connects to the server
@sio.event
def connect():
    # Print a message to the console
    print("I'm connected!")

    # Emit a 'message' event to the server with the data 'Hello, server!'
    sio.emit('message', 'Hello, server!')

    # Emit a 'humanMove' event to the server with a random index between 0 and 8
    sio.emit('humanMove', {'index': random.randint(0, 8)})

# Define an event handler for the 'message' event
# This event is emitted by the server when it sends a message to the client
@sio.on('message')
def on_message(data):
    # Print the received message to the console
    print('Received message: ', data)

# Define an event handler for the 'backendAI' event
# This event is emitted by the server when it sends a backendAI message to the client
@sio.on('backendAI')
def on_backendAI(data):
    # Print the received backendAI message to the console
    print('Received backendAI: ', data)

# Connect the client to the server at 'http://localhost:3000'
sio.connect('http://localhost:3000')

# Wait for events
# This keeps the application running so it can receive events from the server
sio.wait()
