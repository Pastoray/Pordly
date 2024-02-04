from flask import Blueprint, request, jsonify
from database import UserDailyQuests, DailyQuests, db
from datetime import date
from blueprints.Stats import update_streak, update_lives, update_gems, update_xp

dailyquest_bp = Blueprint("dailyquest", __name__)

@dailyquest_bp.route("/check", methods=["POST"])
def check_daily_quest():
    data = request.get_json()
    user_id = data.get("user_id")
    quest_id = data.get("quest_id")
    
    quest = UserDailyQuests.query.filter_by(_user_id=user_id, _quest_id=quest_id).first()
    if not quest.isComplete:
        quest.isComplete = True
        lives = quest.lives
        gems = quest.gems
        xp = quest.xp
        
        db.session.commit()

        update_lives(user_id, lives)
        update_gems(user_id, gems)
        update_xp(user_id, xp)
        update_streak(user_id)

@dailyquest_bp.route("/fetch", methods=["POST"])
def get_user_daily_quests():
    data = request.get_json()
    user_id = data.get("user_id")
    quests = []

    try:
        daily_quests = DailyQuests.query.filter_by(date=date.today())
        for daily_quest in daily_quests:
            user_daily_quest = UserDailyQuests.query.filter_by(_dailyquest_id=daily_quest._dailyquest_id, _user_id=user_id).first()
            quests.append({
                "daily_quest_id": daily_quest._dailyquest_id,
                "title": daily_quest.title,
                "date": daily_quest.date,
                "requirements": {
                    "accuracy": daily_quest.accuracy_req,
                    "wpm": daily_quest.accuracy_req,
                    "time": daily_quest.accuracy_req
                },
                "difficulty": daily_quest.difficulty,
                "reward": {
                    "gems": daily_quest.gems,
                    "xp": daily_quest.xp,
                    "lives": daily_quest.lives
                },
                "isComplete": user_daily_quest.isComplete
            })
        return jsonify(quests)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

