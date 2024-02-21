from flask import Blueprint, jsonify
from database import *

all_bp = Blueprint("all", __name__)

@all_bp.route('/users', methods=["POST", "GET"])
def all_users():
    try:
        all_entries = Users.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "user_id": entry._user_id,
                    "username": entry.username,
                    "email": entry.email,
                    "hashed_password": entry.hashed_password
                }
            )
        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@all_bp.route('/stats', methods=["POST", "GET"])
def all_user_stats():
    try:
        all_entries = Stats.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "stats_id": entry._stats_id,
                    "user_id": entry._user_id,
                    "xp": entry.xp,
                    "level": entry.level,
                    "title": entry.title,
                    "streak": entry.streak,
                    "gems": entry.gems,
                    "lives": entry.lives
                }
            )
        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
        

    
@all_bp.route('/levels', methods=["POST", "GET"])
def all_levels():
    try:
        all_entries = Levels.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                    {
                        "level_id": entry._level_id,
                        "level": entry.level,
                        "xp_required": entry.xp_required,
                        "color": entry.color
                    }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/titles', methods=["POST", "GET"])
def all_titles():
    try:
        all_entries = Titles.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "title_id": entry._title_id,
                    "title": entry.title,
                    "level_required": entry.level_required,
                    "color": entry.color
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/daily-quests', methods=["POST", "GET"])
def all_daily_quests():
    try:
        all_entries = DailyQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "daily_quest_id": entry._daily_quest_id,
                    "title": entry.title,
                    "requirements": entry.requirements,
                    "date": entry.date,
                    "paras": entry.paras,
                    "difficulty": entry.difficulty,
                    "rewards": entry.rewards
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/user-daily-quests', methods=["POST", "GET"])
def all_user_daily_quests():
    try:
        all_entries = UserDailyQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "user_daily_quests_id": entry._user_daily_quests_id,
                    "user_id": entry._user_id,
                    "daily_quest_id": entry._daily_quest_id,
                    "isComplete": entry.isComplete,
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500 
      
@all_bp.route('/story-quests', methods=["POST", "GET"])
def all_story_quests():
    try:
        all_entries = StoryQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "story_quest_id": entry._story_quest_id,
                    "title": entry.title,
                    "requirements": entry.requirements,
                    "paras": entry.paras,
                    "paragraphs": entry.paras,
                    "difficulty": entry.difficulty,
                    "rewards": entry.rewards
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/user-story-quests', methods=["POST", "GET"])
def all_user_story_quests():
    try:
        all_entries = UserStoryQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "user_story_quests_id": entry._user_story_quests_id,
                    "user_id": entry._user_id,
                    "story_quest_id": entry._story_quest_id,
                    "isComplete": entry.isComplete,
                    "completion_date": entry.completion_date,
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500 
    
@all_bp.route('/achievements', methods=["POST", "GET"])
def all_achievements():
    try:
        all_entries = Achievements.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "achievement_id": entry._achievement_id,
                    "title": entry.title,
                    "description": entry.description,
                    "difficulty": entry.difficulty,
                    "rewards": entry.rewards
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/user-achievements', methods=["POST", "GET"])
def all_user_achievements():
    try:
        all_entries = UserAchievements.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "user_achievements_id": entry._user_achievements_id,
                    "user_id": entry._user_id,
                    "_achievement_id": entry._achievement_id,
                    "isComplete": entry.isComplete,
                    "completion_date": entry.completion_date
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@all_bp.route('/boosters', methods=["POST", "GET"])
def all_boosters():
    try:
        all_entries = Boosters.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "id": entry._booster_id,
                    "title": entry.title,
                    "description": entry.description,
                    "price": entry.price,
                    "category": entry.category,
                    "multiplier": entry.multiplier,
                    "color": entry.color
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/user-boosters', methods=["POST", "GET"])
def all_user_boosters():
    try:
        all_entries = UserBoosters.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "user_boosters_id": entry._user_boosters_id,
                    "user_id": entry._user_id,
                    "booster_id": entry._booster_id,
                    "category": entry.category,
                    "multiplier": entry.multiplier,
                    "isActive": entry.isActive,
                    "expiration_date": entry.expiration_date
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500