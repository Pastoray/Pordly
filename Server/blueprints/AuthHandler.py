from flask import Blueprint, request, jsonify, make_response
from database import *
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta
from utils.Create import create_stats, create_user_daily_quests

auth_bp = Blueprint("auth_bp", __name__)
jwt = JWTManager()

@auth_bp.route("/create_user", methods=["POST"])
def create_account():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": {
                "usernameError": "Invalid Data",
                "emailError": "Invalid Data",
                "passwordError": "Invalid Data",
            }
        }), 400
    
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not (password and email and username):
        return jsonify({"success": False, "error": {
            "usernameError": "Missing username" if not username else "",                                   
            "emailError": "Missing email" if not email else "",
            "passwordError": "Missing password" if not password else ""
            }
        }), 400
    
    usernameExists = Users.query.filter_by(username=username).first()
    emailExists = Users.query.filter_by(email=email).first()
    
    if usernameExists:
        return jsonify({"success": False, "error": {"usernameError": "Username already exists"}}), 400
    elif emailExists:
        return jsonify({"success": False, "error": {"emailError": "Email already exists"}}), 400

    user = Users(username, email, password)
    user_id = user._user_id
    create_stats(user_id)
    return jsonify({"success": True, "message": "Account Created successfully"}), 201

@auth_bp.route("/load_user", methods=["POST"])
def load_account():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": {
                "emailError": "Invalid Data",
                "passwordError": "Invalid Data",
            }
        }), 400
    
    email = data.get("email")
    password = data.get("password")

    if not (password and email):
        return jsonify({
            "success": False,
            "error": {
                "emailError": "Missing email" if not email else "",
                "passwordError": "Missing password" if not password else ""
            }
        }), 400
    
    user = Users.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({
                "success": False,
                "error": {
                    "emailError": "User doesn't exist",
                    "passwordError": "User doesn't exist"
                }
            }), 400
    else:
        if not user.check_password(password):
            return jsonify({
                "success": False,
                "error": {
                    "passwordError": "Wrong password"
                }
            }), 401

    expires = timedelta(days=30)
    accessToken = create_access_token(identity=user._user_id, expires_delta=expires)

    response = make_response(jsonify({
        "success": True,
        "accessToken": accessToken,
        "message": "Logged in successfully"
    }), 200)

    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response

@auth_bp.route('/validate_token', methods=["GET"])
@jwt_required()
def validate_token():
    user_id = get_jwt_identity()
    user = Users.query.filter_by(_user_id=user_id).first()

    user_stats = Stats.query.filter_by(_user_id=user_id).first()
    user_level = Levels.query.filter(Levels.xp_required<=user_stats.xp).first()
    user_title = Titles.query.filter(Titles.level_required<=user_level.level).first()

    daily_quests = create_user_daily_quests(user_id)
    total_quests = []
    for i in range(len(daily_quests)):
        total_quests.append(
            {
                f"daily_quest_{i + 1}": {
                    "date": daily_quests[i].get("date"),
                    "difficulty": daily_quests[i].get("difficulty"),
                    "requirements": {
                        "accuracy": daily_quests[i].get("requirements").get("accuracy"),
                        "time": daily_quests[i].get("requirements").get("time"),
                        "wpm": daily_quests[i].get("requirements").get("wpm")
                    },
                }
            }
        )
    return jsonify({
        "success": (user_id != None),
        "info": {
            "id": user_id,
            "username": user.username
        },
        "stats": {              
            "stats_id": user_stats._stats_id,
            "user_id": user_stats._user_id,
            "xp": user_stats.xp,
            "streak": user_stats.streak,
            "gems": user_stats.gems,
            "lives": user_stats.lives,
            "level": {
                "level_id": user_level._level_id,
                "level": user_level.level,
                "xp_required": user_level.xp_required,
                "color": user_level.color
            },
            "title": {
                "title_id": user_title._title_id,
                "title": user_title.title,
                "level_required": user_title.level_required,
                "color": user_title.color
            }
        },
        "quests": {
            "quests": {

            },

            "daily_quests": {

            },

            "achivements": {
                
            }
        }
    }), 200
