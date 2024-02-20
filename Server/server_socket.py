from flask import Blueprint, request
from flask_socketio import join_room, emit, leave_room
import heapq
import uuid

socket_bp = Blueprint("socket", __name__)

queue = []
sid_to_user_id = {}
user_id_to_room_code = {}
player_to_player = {}
stats = {}
player_final_duel_stats = {}

code = str(uuid.uuid4())

def init_socket(socket):
    @socket.on("initial_data")
    def initial_data(data):
        user_id = data.get("user_id")
        user_level = data.get("user_level")

        if user_id not in user_id_to_room_code:

            heapq.heappush(queue, (user_level, user_id))

            sid_to_user_id[request.sid] = user_id
            user_id_to_room_code[user_id] = code

            join_room(code)

        if len(queue) >= 2:
            duel()
    
    @socket.on("disconnect")
    def disconnect():
        user_id_1 = sid_to_user_id.pop(request.sid, None)
        player_to_player.pop(user_id_1, None)

        stats.pop(user_id_1, None)

        for i in range(len(queue)):
            if queue[i][1] == user_id_1:
                queue.pop(i)
                break
                
        room_code = user_id_to_room_code.pop(user_id_1, None)
        if room_code:
            leave_room(room_code)

    def duel():
        _, user_id_1 = heapq.heappop(queue)
        _, user_id_2 = heapq.heappop(queue)

        player_to_player[user_id_1] = user_id_2
        player_to_player[user_id_2] = user_id_1
        
        room_code = user_id_to_room_code[user_id_1]

        emit('response', {"message": 'You are in the duel!', "match_found": True}, room=room_code)
        code = str(uuid.uuid4())

    @socket.on("renew_stats")
    def renew_stats(data):
        user_id = data.get("user_id")
        stats[user_id] = (data.get("accuracy"), data.get("wpm"))

    @socket.on("fetch_opponent_stats")
    def fetch_oponent_stats(data):
        user_id = data.get("user_id")
        opponent_id = player_to_player[user_id]
        opponent_stats = stats.get(opponent_id, (0, 0))
        response = {
            "accuracy": opponent_stats[0],
            "wpm": opponent_stats[1],
        }

        emit("opponent_stats", response)

    return socket_bp