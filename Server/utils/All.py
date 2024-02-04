from flask import Blueprint, jsonify, request
from database import *

all_bp = Blueprint("all", __name__)

@all_bp.route('/users', methods=["GET", "POST"])
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
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@all_bp.route('/stats', methods=["GET", "POST"])
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
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
        
@all_bp.route('/user_daily_quests', methods=["GET", "POST"])
def all_user_daily_quests():
    try:
        all_entries = UserDailyQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "user_daily_quests_id": entry._userdailyquests_id,
                    "user_id": entry._user_id,
                    "daily_quest_id": entry._dailyquest_id,
                    "isComplete": entry.isComplete,
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/levels', methods=["GET", "POST"])
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
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/titles', methods=["GET", "POST"])
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
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/daily_quests', methods=["GET", "POST"])
def all_daily_quests():
    try:
        all_entries = DailyQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(
                {
                    "daily_quest_id": entry._dailyquest_id,
                    "title": entry.title,
                    "accuracy_req": entry.accuracy_req,
                    "wpm_req": entry.accuracy_req,
                    "time_req": entry.accuracy_req,
                    "difficulty": entry.difficulty,
                    "date": entry.date,
                    "gems": entry.gems,
                    "xp": entry.xp,
                    "lives": entry.lives
                }
            )

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500