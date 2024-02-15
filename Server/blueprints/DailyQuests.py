from flask import Blueprint, request, jsonify
from database import UserDailyQuests, DailyQuests, db
from datetime import date
from blueprints.Stats import *
import calendar

daily_quests_bp = Blueprint("daily_quests", __name__)

@daily_quests_bp.route("/check", methods=["POST"])
def check_daily_quest():
    data = request.get_json()
    user_id = data.get("user_id")
    quest_id = data.get("quest_id")
    
    user_daily_quest = UserDailyQuests.query.filter_by(_user_id=user_id, _daily_quest_id=quest_id).first()
    daily_quest = DailyQuests.query.filter_by(_daily_quest_id=quest_id).first()
    if not user_daily_quest.isComplete:
        rewards = daily_quest.rewards
        lives = rewards.get("lives")
        gems = rewards.get("gems")
        xp = rewards.get("xp")
        
        user_daily_quest.isComplete = True
        db.session.commit()
        
        if lives > 0:
            update_lives(user_id, lives)
        if gems > 0:
            update_gems(user_id, gems)
        if xp > 0:
            update_xp(user_id, xp) 
        update_streak(user_id)
        

    return jsonify({"success": True, "quest_complete": user_daily_quest.isComplete})

@daily_quests_bp.route("/fetch", methods=["POST"])
def get_user_daily_quests():
    data = request.get_json()
    user_id = data.get("user_id")
    quests = []

    try:
        daily_quests = DailyQuests.query.filter_by(date=date.today())
        for daily_quest in daily_quests:
            user_daily_quest = UserDailyQuests.query.filter_by(_daily_quest_id=daily_quest._daily_quest_id, _user_id=user_id).first()
            quests.append({
                "daily_quest_id": daily_quest._daily_quest_id,
                "title": daily_quest.title,
                "date": daily_quest.date,
                "requirements": daily_quest.requirements,
                "difficulty": daily_quest.difficulty,
                "reward": daily_quest.rewards,
                "isComplete": user_daily_quest.isComplete
            })
        return jsonify(quests)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@daily_quests_bp.route("/reset", methods=["POST"])
def reset_quests():
    data = request.get_json()
    user_id = data.get("user_id")

    daily_quests = DailyQuests.query.filter_by(date=date.today())
    for quest in daily_quests:
        user_daily_quest = UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest._dailyquest_id).first()
        user_daily_quest.isComplete = False
    db.session.commit()
    return jsonify({"success": True})

@daily_quests_bp.route("/this-month", methods=["POST"])
def get_daily_quests_of_this_month():
    data = request.get_json()
    user_id = data.get("user_id")
    
    current_date = date.today()
    current_year = (int(str(current_date).split("-")[0]))
    current_month = (int(str(current_date).split("-")[1]))
    current_month_days = calendar.monthrange(current_year, current_month)[1]

    result = []
    for day in range(1, date.today().day + 1):
        current_date = date(date.today().year, date.today().month, day)
        day_daily_quests = DailyQuests.query.filter_by(date=current_date).order_by(DailyQuests._daily_quest_id.asc())
        temp = []
        for quest in day_daily_quests:
            user_daily_quest = UserDailyQuests.query.filter_by(_user_id=user_id, _daily_quest_id=quest._daily_quest_id).first()
            if user_daily_quest:
                temp.append(user_daily_quest)
        result.append(all(q.isComplete for q in temp) if temp and len(temp) == 3 else False)

    return jsonify({"user_daily_quests": result, "days_this_month": current_month_days})