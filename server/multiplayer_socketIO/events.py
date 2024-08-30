from flask_socketio import emit, join_room
from flask import request, session
from . import socketio
import random

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    emit('message', "yoooo", broadcast=True)


@socketio.on('humanMove')
def handle_message(msg):
    print(f"Message: {msg}", msg['index'])
    x = random.randint(0, 8)
    d = {
        'player': 2,
        'index': x
    }
    emit('backendAI', d, broadcast=True)

waiting_players = []
games = {}

@socketio.on('join_queue')
def join_queue():
    username = session.get('username', None)
    if not username:
        print("NO SESSION\n\n")
        return None
    print('session', username, games, waiting_players)
    if username not in waiting_players:
        waiting_players.append(username)
        join_room(username)
        # emit('game_id', session_id)


    if len(waiting_players) >= 2:
        player1 = waiting_players.pop(0)
        player2 = waiting_players.pop(0)
        game_id = f"{player1}_{player2}"
        games[game_id] = {'player1': player1, 'player2': player2, 'grid': [None] * 9}

        emit('start_game', {'game_id': game_id, 'player': 1}, room=player1)
        emit('start_game', {'game_id': game_id, 'player': 2}, room=player2)
        print('EMITTTTTTT\n\n\n\n\n\n', games[game_id], game_id)

@socketio.on('humanMove')
def handle_human_move(data):
    username = session.get('username', None)
    print('HUMANNNNNmv', username, data)
    game_id = data['game_id']
    game = games.get(game_id)

    if not game:
        return

    if username == game['player1']:
        opponent = game['player2']
        player = 1
    else:
        opponent = game['player1']
        player = 2

    index = data['index']
    if game['grid'][index] is None:
        game['grid'][index] = player
        emit('move', {'index': index, 'player': player}, room=opponent)
