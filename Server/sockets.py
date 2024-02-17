from flask_socketio import send

users_counter = 0

def init_socketio(socketio):
    @socketio.on('connect')
    def handle_connection():
        global users_counter
        users_counter += 1
        send(users_counter)
        print(users_counter)
        print("counter: ", users_counter)

    @socketio.on('disconnect')
    def handle_disconnection():
        global users_counter
        users_counter -= 1
        send(users_counter)
        print(users_counter)
        print("counter: ", users_counter)

    @socketio.on('message')
    def handle_message(message):
        global users_counter
        print('counter: ', users_counter)
        send(users_counter)
    
