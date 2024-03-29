from flask import Flask
from database import db
from flask_socketio import SocketIO

from server_socket import init_socket

from blueprints.Authentication import jwt, auth_bp
from blueprints.Stats import stats_bp
from blueprints.Achivements import achievements_bp
from blueprints.DailyQuests import daily_quests_bp
from blueprints.StoryQuests import story_quests_bp
from blueprints.Leaderboards import leaderboards_bp
from blueprints.Boosters import boosters_bp

from utils.Create import create_bp
from utils.All import all_bp
from utils.Clear import clear_bp

from dotenv import load_dotenv
import logging
from flask_cors import CORS
import os


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, supports_credentials=True, origins="http://localhost:5173")

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

secret_key = os.urandom(24)

load_dotenv()
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.secret_key = secret_key

app.register_blueprint(create_bp, url_prefix="/create")
app.register_blueprint(clear_bp, url_prefix="/clear")
app.register_blueprint(all_bp, url_prefix="/all")

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(stats_bp, url_prefix="/stats")
app.register_blueprint(achievements_bp, url_prefix="/achievements")
app.register_blueprint(leaderboards_bp, url_prefix="/leaderboards")
app.register_blueprint(daily_quests_bp, url_prefix="/daily-quests")
app.register_blueprint(story_quests_bp, url_prefix="/story-quests")
app.register_blueprint(boosters_bp, url_prefix="/boosters")

app.register_blueprint(init_socket(socketio), url_prefix="/queue")

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt.init_app(app)

@app.route("/")
def home():
    return "Home"

with app.app_context():
    db.create_all()
    #db.drop_all()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8080, debug=True, allow_unsafe_werkzeug=True)