import socketio
import random

sio = socketio.Client()

@sio.event
def connect():
    print("I'm connected!")
    sio.emit('message', 'Hello, server!')
    sio.emit('humanMove', {'index': random.randint(0, 8)})

@sio.on('message')
def on_message(data):
    print('Received message: ', data)

@sio.on('backendAI')
def on_backendAI(data):
    print('Received backendAI: ', data)

sio.connect('http://localhost:3000')
sio.wait()
