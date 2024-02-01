from flask import Blueprint, request, jsonify
from database import *
from datetime import date

create_bp = Blueprint("create", __name__)

@create_bp.route("/users", methods=["POST"])
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

def create_stats(user_id):
    row = Titles.query.filter(Titles.level_required<=1).first()
    title = row.title
    Stats(user_id, 0, 1, title, 0, 100, 5)

@create_bp.route("/user_daily_quests", methods=["POST"])
def create_user_daily_quests():
    data = request.get_json()

    user_id = data.get("user_id")

    entries = DailyQuests.query.filter_by(date=date.today())
    quests = []
    for entry in entries:
        quests.append({
            "title": entry.title,
            "description": entry.description,
            "difficulty": entry.difficulty,
            "date": entry.date,
            "reward": entry.reward,
        })
        quest_id = entry.id
        quest_in_table = UserDailyQuests.query.filter_by(quest_id=quest_id).first()
        if not quest_in_table:
            UserDailyQuests(user_id, quest_id, False, None)
    return jsonify(quests)

@create_bp.route("/levels", methods=["POST"])
def create_level():
    data = request.get_json()
    levels = []
    for entry in data:
        level = entry.get("level")
        xp_required = entry.get("xp_required")
        color = entry.get("color")

        Levels(level, xp_required, color)
        levels.append({"level_created": {
            "level": level,
            "xp_required": xp_required,
            "color": color
        }
    })
    return jsonify(levels), 201

@create_bp.route("/titles", methods=["POST"])
def create_title():
    data = request.get_json()
    titles = []
    for entry in data:
        title = entry.get("title")
        level_required = entry.get("level_required")
        color = entry.get("color")

        Titles(title, level_required, color)
        titles.append({"title_created": {
                "title": title,
                "level_required": level_required,
                "color": color
            }
        })
    return jsonify(titles), 201

@create_bp.route("/daily_quests", methods=["POST"])
def create_daily():
    data = request.get_json()
    quests = []
    for entry in data:
        quest_difficulty = entry.get("quest_difficulty")
        quest_date = date.today()
        quest_reward = entry.get("quest_reward")

        DailyQuests(quest_difficulty, quest_date, quest_reward)
        quests.append({"daily_quest_created": {
                "difficulty": quest_difficulty,
                "date": date.today(),
                "reward": quest_reward
            }
        })
    return jsonify(quests), 201

    