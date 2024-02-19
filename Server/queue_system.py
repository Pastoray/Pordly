from flask import Blueprint, jsonify
from flask_socketio import join_room, emit
import heapq
import uuid

queue_bp = Blueprint("queue", __name__)

users = []
rooms = [str(uuid.uuid4())]
idx = 0

# TODO : fix -> you can queue yourself + you can queue people who already left the queue

def init_socket(socket):
    @socket.on("initial_data")
    def initial_data(data):
        user_id = data.get("user_id")
        user_level = data.get("user_level")

        heapq.heappush(users, (user_level, user_id))

        if idx >= len(rooms):
            rooms.append(str(uuid.uuid4()))
        join_room(rooms[idx])
        if len(users) >= 2:
            duel()

        return jsonify({"success": True})
        
    def duel():
        global idx
        user_level1, user_id1 = heapq.heappop(users)
        user_level2, user_id2 = heapq.heappop(users)

        emit('response', {"message": 'You are in the duel!', "match_found": True}, room=rooms[idx])
        idx += 1
    
        return jsonify({"success": True})

    return queue_bp