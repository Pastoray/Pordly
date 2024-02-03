from flask import Blueprint, request, jsonify
from database import *
from datetime import date

create_bp = Blueprint("create", __name__)

def create_stats(user_id):
    row = Titles.query.filter(Titles.level_required<=1).first()
    title = row.title
    Stats(user_id, 0, 1, title, 0, 100, 5)

@create_bp.route("/user_daily_quests", methods=["POST"])
def create_user_daily_quests(user_id=None):

    if not user_id:
        data = request.get_json()
        user_id = data.get("user_id")
    
    entries = DailyQuests.query.filter_by(date=date.today())
    quests = []
    for entry in entries:
        quests.append({
            "title": entry.title,
            "requirements": {
                "accuracy": entry.accuracy_req,
                "wpm": entry.wpm_req,
                "time": entry.time_req,
            },
            "difficulty": entry.difficulty,
            "date": entry.date,
            "rewards": {
                "xp": entry.xp,
                "gems": entry.gems,
                "lives": entry.lives
            }
        })
        quest_id = entry._dailyquest_id
        quest_in_table = UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest_id).first()
        if not quest_in_table:
            UserDailyQuests(user_id, quest_id, False)
    return quests
    
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
        title = entry.get("title")
        requirements = entry.get("requirements")
        difficulty = entry.get("difficulty")
        quest_date = entry.get("date")
        reward = entry.get("reward")

        date_object = quest_date.split("-")

        quest_date = date(int(date_object[0]), int(date_object[1]), int(date_object[2]))

        DailyQuests(
            title,
            requirements.get("accuracy_req"),
            requirements.get("wpm_req"),
            requirements.get("time_req"),
            difficulty,
            quest_date,
            reward.get("xp"),
            reward.get("gems"),
            reward.get("lives")
            )
        quests.append({"daily_quest_created": {
                "title": title,
                "requirements": {
                    "accuracy_req": requirements.get("accuracy_req"),
                    "wpm_req": requirements.get("wpm_req"),
                    "time_req": requirements.get("time_req"),
                },
                "difficulty": difficulty,
                "date": quest_date,
                "reward": {
                    "xp": reward.get("xp"),
                    "gems": reward.get("gems"),
                    "lives": reward.get("lives")
                }
            }
        })
    return jsonify(quests), 201

    