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
    
    user_daily_quest = UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest_id).first()
    v = user_daily_quest.isComplete
    daily_quest = DailyQuests.query.filter_by(_dailyquest_id=quest_id).first()
    if not user_daily_quest.isComplete:
        lives = daily_quest.lives
        gems = daily_quest.gems
        xp = daily_quest.xp
        
        user_daily_quest.isComplete = True
        db.session.commit()
        
        if lives > 0:
            update_lives(user_id, lives)
        if gems > 0:
            update_gems(user_id, gems)
        if xp > 0:
            update_xp(user_id, xp) 
        update_streak(user_id)
        

    return jsonify({"success": True, "questcomplete": v})

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

@dailyquest_bp.route("/reset", methods=["POST"])
def reset_quests():
    data = request.get_json()
    user_id = data.get("user_id")

    daily_quests = DailyQuests.query.filter_by(date=date.today())
    for quest in daily_quests:
        user_daily_quest = UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest._dailyquest_id).first()
        user_daily_quest.isComplete = False
    db.session.commit()
    return jsonify({"success": True})


