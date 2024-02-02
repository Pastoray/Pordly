from flask import Blueprint, request
from database import UserDailyQuests, db
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

