from flask import Blueprint, request
from database import * 
from blueprints.Stats import *

story_quests_bp = Blueprint("story_quests", __name__)

@story_quests_bp.route("/check", methods=["POST"])
def check_story_quest():
    data = request.get_json()
    user_id = data.get("user_id")
    quest_id = data.get("quest_id")

    story_quest = UserStoryQuests.query.filter_by(_user_id=user_id, _story_quest_id=quest_id).first()
    user_story_quest = StoryQuests.query.filter_by(_story_quest_id=quest_id).first()
    
    if not user_story_quest.isComplete:
        rewards = story_quest.rewards
        lives = rewards.lives
        gems = rewards.gems
        xp = rewards.xp
        
        user_story_quest.isComplete = True
        user_story_quest.completion_date = date.today()
        db.session.commit()
        
        if lives > 0:
            update_lives(user_id, lives)
        if gems > 0:
            update_gems(user_id, gems)
        if xp > 0:
            update_xp(user_id, xp) 
        update_streak(user_id)

    return jsonify({"success": True, "quest_complete": user_story_quest.isComplete})

@story_quests_bp.route("/fetch", methods=["POST"])
def get_user_story_quests():
    data = request.get_json()
    user_id = data.get("user_id")
    quests = []

    try:
        story_quests = StoryQuests.query.all()
        for story_quest in story_quests:
            user_story_quest = UserStoryQuests.query.filter_by(_story_quest_id=story_quest._story_quest_id, _user_id=user_id).first()
            quests.append({
                "story_quest_id": story_quest._story_quest_id,
                "title": story_quest.title,
                "requirements": {
                    "accuracy": story_quest.accuracy_req,
                    "wpm": story_quest.wpm_req,
                    "time": story_quest.time_req
                },
                "difficulty": story_quest.difficulty,
                "reward": {
                    "xp": story_quest.xp,
                    "gems": story_quest.gems,
                    "lives": story_quest.lives
                },
                "isComplete": user_story_quest.isComplete,
                "completion_date": user_story_quest.completion_date
            })
        return jsonify(quests)
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
 

