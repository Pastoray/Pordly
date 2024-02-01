from flask import Blueprint, jsonify
from database import *
clear_bp = Blueprint("clear", __name__)

@clear_bp.route("/users")
def clear_users():
    try:
        db.session.query(Users).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/stats")
def clear_stats():
    try:
        db.session.query(Stats).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@clear_bp.route("/user_daily_quests")
def clear_user_daily_quests():
    try:
        db.session.query(UserDailyQuests).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/levels")
def clear_levels():
    try:
        db.session.query(Levels).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/titles")
def clear_titles():
    try:
        db.session.query(Titles).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@clear_bp.route("/daily_quests")
def clear_daily_quests():
    try:
        db.session.query(DailyQuests).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@clear_bp.route("/all")
def clear_all():
    models = [Levels, DailyQuests, Titles, Users, Stats, UserDailyQuests]
    try:
        for model in models:
            db.session.query(model).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500