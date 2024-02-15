from flask import Blueprint, request, jsonify, make_response
from database import *
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta
from utils.Create import *
from blueprints.Stats import get_streak

auth_bp = Blueprint("auth_bp", __name__)
jwt = JWTManager()

@auth_bp.route("/create-user", methods=["POST"])
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

    create_user_stats(user_id)
    create_user_story_quests(user_id)
    create_user_achievements(user_id)

    return jsonify({"success": True, "message": "Account Created successfully"}), 201

@auth_bp.route("/load-user", methods=["POST"])
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

@auth_bp.route('/validate-token', methods=["GET"])
@jwt_required()
def validate_token():
    user_id = get_jwt_identity()
    user = Users.query.filter_by(_user_id=user_id).first()
    user_stats = Stats.query.filter_by(_user_id=user_id).first()
    user_level = Levels.query.filter(Levels.xp_required<=user_stats.xp).order_by(Levels.xp_required.desc()).first()
    user_title = Titles.query.filter(Titles.level_required<=user_level.level).order_by(Titles.level_required.desc()).first()
    
    create_user_daily_quests(user_id)
    get_streak(user_id)
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
        }
    }), 200

@auth_bp.route("/change-email", methods=["POST"])
def change_email():
    data = request.get_json()
    user_id = data.get("user_id")
    email = data.get("email")
    password = data.get("password")
    new_email = data.get("new_email")

    user = Users.query.filter_by(_user_id=user_id, email=email).first()

    if user:
        hashed_password = generate_password_hash(password)
        
        if check_password_hash(user.hashed_password, hashed_password):
            user.email = new_email
            db.session.commit()
            return jsonify({"message": "Email updated successfully"}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "Invalid email"}), 404
    
@auth_bp.route("/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    user_id = data.get("user_id")
    email = data.get("email")
    password = data.get("password")
    new_password = data.get("new_password")

    user = Users.query.filter_by(_user_id=user_id, email=email).first()

    if user:
        hashed_password = generate_password_hash(password)
        
        if check_password_hash(user.hashed_password, hashed_password):
            new_password = generate_password_hash(new_password)
            user.password = new_password
            db.session.commit()
            return jsonify({"message": "Password updated successfully"}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "Invalid email"}), 404

@auth_bp.route("/delete", methods=["DELETE"])
def delete_account():
    data = request.get_json()
    user_id = data.get("user_id")
    email = data.get("email")
    password = data.get("password")

    user = Users.query.filter_by(_user_id=user_id, email=email).first()

    if user:
        hashed_password = generate_password_hash(password)
        
        if check_password_hash(user.hashed_password, hashed_password):
            db.session.delete(user)
            db.session.commit()
            return jsonify({"message": "Account deleted successfully"}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "Invalid email"}), 404

