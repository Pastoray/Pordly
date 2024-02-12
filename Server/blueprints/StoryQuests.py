from flask import Blueprint, request
from database import * 
from blueprints.Stats import *

story_quests_bp = Blueprint("story_quests", __name__)

@story_quests_bp.route("/check", methods=["POST"])
def check_story_quest():
    data = request.get_json()
    user_id = data.get("user_id")
    quest_id = data.get("quest_id")

    user_story_quest = UserStoryQuests.query.filter_by(_user_id=user_id, _story_quest_id=quest_id).first()
    story_quest = StoryQuests.query.filter_by(_story_quest_id=quest_id).first()
    
    if not user_story_quest.isComplete:
        rewards = story_quest.rewards
        lives = rewards.get("lives")
        gems = rewards.get("gems")
        xp = rewards.get("xp")
        
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
        all_user_story_quests_query = UserStoryQuests.query.filter_by(_user_id=user_id)
        all_user_story_quests = []

        for quest in all_user_story_quests_query:
            all_user_story_quests.append(UserStoryQuests.query.filter_by(_user_id=user_id, _story_quest_id=quest._story_quest_id).first())

        all_user_story_quests_completed = all(quest.isComplete for quest in all_user_story_quests)
        if all_user_story_quests_completed:
            check_achievement(user_id, 3)

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
                "requirements": story_quest.requirements,
                "difficulty": story_quest.difficulty,
                "reward": story_quest.rewards,
                "isComplete": user_story_quest.isComplete,
                "completion_date": user_story_quest.completion_date
            })
        return jsonify(quests)
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
 

