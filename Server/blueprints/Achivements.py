from flask import Blueprint, request, jsonify
from blueprints.Stats import *
from database import *

achievements_bp = Blueprint("achievements", __name__)

@achievements_bp.route("/check", methods=["POST"])
def check_achievement():
    data = request.get_json()
    user_id = data.get("user_id")
    achievement_id = data.get("achievement_id")
    
    user_achievement = UserAchievements.query.filter_by(_user_id=user_id, _achievement_id=achievement_id).first()
    achievement = Achievements.query.filter_by(_achievement_id=achievement_id).first()
    if not user_achievement.isComplete:
        rewards = achievement.rewards
        lives = rewards.get("lives")
        gems = rewards.get("gems")
        xp = rewards.get("xp")
        
        user_achievement.isComplete = True
        user_achievement.completion_date = date.today()
        db.session.commit()
        
        if lives > 0:
            update_lives(user_id, lives)
        if gems > 0:
            update_gems(user_id, gems)
        if xp > 0:
            update_xp(user_id, xp) 

    return jsonify({"success": True, "achivement_complete": user_achievement.isComplete})

@achievements_bp.route("/fetch", methods=["POST"])
def get_user_achievements():
    data = request.get_json()
    user_id = data.get("user_id")
    total_achievements = []

    try:
        achievements = Achievements.query.all()
        for achievement in achievements:
            user_achievements = UserAchievements.query.filter_by(_achievement_id=achievement._achievement_id, _user_id=user_id).first()
            total_achievements.append({
                "achievement_id": achievement._achievement_id,
                "title": achievement.title,
                "description": achievement.description,
                "difficulty": achievement.difficulty,
                "rewards": achievement.rewards,
                "isComplete": user_achievements.isComplete,
                "completion_date": user_achievements.completion_date
            })
        return jsonify(total_achievements)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@achievements_bp.route("/reset", methods=["POST"])
def reset_achievements():
    data = request.get_json()
    user_id = data.get("user_id")

    achievements = Achievements.query.all()
    for achievement in achievements:
        user_achievement = UserAchievements.query.filter_by(_user_id=user_id, _achievement_id=achievement._achievement_id).first()
        user_achievement.isComplete = False
        user_achievement.completion_date = None
    db.session.commit()
    return jsonify({"success": True})


