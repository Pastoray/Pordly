from flask import Blueprint, jsonify
from database import *

clear_bp = Blueprint("clear", __name__)

@clear_bp.route("/users", methods=["POST", "GET"])
def clear_users():
    try:
        db.session.query(Users).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/stats", methods=["POST", "GET"])
def clear_stats():
    try:
        db.session.query(Stats).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/levels", methods=["POST", "GET"])
def clear_levels():
    try:
        db.session.query(Levels).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/titles", methods=["POST", "GET"])
def clear_titles():
    try:
        db.session.query(Titles).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/daily-quests", methods=["POST", "GET"])
def clear_daily_quests():
    try:
        db.session.query(DailyQuests).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@clear_bp.route("/user-daily-quests", methods=["POST", "GET"])
def clear_user_daily_quests():
    try:
        db.session.query(UserDailyQuests).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@clear_bp.route("/story-quests", methods=["POST", "GET"])
def clear_story_quests():
    try:
        db.session.query(StoryQuests).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/user-story-quests", methods=["POST", "GET"])
def clear_user_story_quests():
    try:
        db.session.query(UserStoryQuests).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/all", methods=["POST", "GET"])
def clear_all():
    models = [Levels, DailyQuests, StoryQuests, Titles, Users, Stats, UserDailyQuests, UserStoryQuests]
    try:
        for model in models:
            db.session.query(model).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500