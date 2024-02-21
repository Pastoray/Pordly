from flask import Blueprint, request
from flask_socketio import join_room, emit, leave_room, close_room
import heapq
import uuid
from blueprints.Stats import update_gems
from blueprints.Achivements import check_user_achievement

socket_bp = Blueprint("socket", __name__)

queue = []
sid_to_user_id = {}
user_id_to_room_code = {}
user_to_user = {}
user_stats = {}

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

    @socket.on("match_finished")
    def match_finished():
        user_id_1 = sid_to_user_id.pop(request.sid, None)
        user_id_2 = user_to_user.pop(user_id_1, None)

        user_1_stats = user_stats.pop(user_id_1, None)
        user_2_stats = user_stats.pop(user_id_2, None)

        room_code = user_id_to_room_code.pop(user_id_1, None)

        if user_1_stats and user_2_stats:
            if (user_1_stats[0] * 10 + user_1_stats[1] * 5 > user_2_stats[0] * 10 + user_2_stats[1] * 5):
                update_gems(user_id_1, 50)
                update_gems(user_id_2, -50)
                check_user_achievement(user_id_1, 9)
            elif (user_1_stats[0] * 10 + user_1_stats[1] * 5 == user_2_stats[0] * 10 + user_2_stats[1] * 5):
                update_gems(user_id_1, -50)
                update_gems(user_id_2, -50)
            else:
                update_gems(user_id_1, -50)
                update_gems(user_id_2, 50)
                check_user_achievement(user_id_2, 9)
        
        if room_code in socket.server.manager.rooms:
            close_room(room_code)
        

    @socket.on("disconnect")
    def disconnect():
        user_id_1 = sid_to_user_id.pop(request.sid, None)
        user_id_2 = user_to_user.pop(user_id_1, None)
        user_to_user.pop(user_id_2, None)

        user_1_stats = user_stats.pop(user_id_1, None)
        if user_1_stats:
            user_stats.pop(user_id_2, None)
            update_gems(user_id_1, -50)
            update_gems(user_id_2, 50)
            check_user_achievement(user_id_2, 9)

            user_id_to_room_code.pop(user_id_2, None)
            room_code = user_id_to_room_code.pop(user_id_1, None)

            emit("match_canceled", room=room_code)
            close_room(room_code)

        else:
            for i in range(len(queue)):
                if queue[i][1] == user_id_1:
                    queue.pop(i)
                    break

            sid_to_user_id.pop(request.sid, None)
            user_id_to_room_code.pop(user_id_1, None)
            leave_room(code)
    
    
    


    def duel():
        global code
        _, user_id_1 = heapq.heappop(queue)
        _, user_id_2 = heapq.heappop(queue)

        user_to_user[user_id_1] = user_id_2
        user_to_user[user_id_2] = user_id_1

        emit('match_found', room=code)
        code = str(uuid.uuid4())

    @socket.on("refresh_user_stats")
    def refresh_user_stats(data):
        user_id = data.get("user_id")
        user_stats[user_id] = (data.get("accuracy"), data.get("wpm"))

    @socket.on("fetch_opponent_stats")
    def fetch_oponent_stats(data):
        user_id = data.get("user_id")
        opponent_id = user_to_user[user_id]
        opponent_stats = user_stats.get(opponent_id, (0, 0))
        response = {
            "accuracy": opponent_stats[0],
            "wpm": opponent_stats[1],
        }

        emit("opponent_stats", response)

    return socket_bp