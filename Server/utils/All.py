from flask import Blueprint, jsonify
from database import *

all_bp = Blueprint("all", __name__)

@all_bp.route('/users', methods=["GET"])
def all_users():
    try:
        all_entries = Users.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(entry.properties())

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/stats', methods=["GET"])
def all_stats():
    try:
        all_entries = Stats.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(entry.properties())

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/user_daily_quests', methods=["GET"])
def all_user_daily_quests():
    try:
        all_entries = UserDailyQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(entry.properties())

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/levels', methods=["GET"])
def all_levels():
    try:
        all_entries = Levels.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(entry.properties())

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/titles', methods=["GET"])
def all_titles():
    try:
        all_entries = Titles.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(entry.properties())

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@all_bp.route('/daily_quests', methods=["GET"])
def all_daily_quests():
    try:
        all_entries = DailyQuests.query.all()
        entries_list = []

        for entry in all_entries:
            entries_list.append(entry.properties())

        return jsonify({"entries": entries_list}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500