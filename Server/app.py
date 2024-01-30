from flask import Flask
from database import db
from blueprints.AuthHandler import auth_bp
from blueprints.Achivements import achivements_bp
from blueprints.Stats import stats_bp
import os
from dotenv import load_dotenv
from blueprints.AuthHandler import jwt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="http://localhost:5173")

secret_key = os.urandom(24)

load_dotenv()
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

app.secret_key = secret_key
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(achivements_bp, url_prefix="/achievements")
app.register_blueprint(stats_bp, url_prefix="/stats")

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
    app.run(host="0.0.0.0", port=8080, debug=True)#, ssl_context='adhoc')