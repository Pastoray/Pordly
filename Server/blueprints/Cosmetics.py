from flask import Blueprint, request, jsonify
from database import Levels, DailyQuests, Titles, db
from datetime import date

cosmetics_bp = Blueprint("cosmetics", __name__)

@cosmetics_bp.route("/level", methods=["POST"])
def insert_level():
    data = request.get_json()
    lvl = data.get("level")
    xp_required = data.get("xp_required")
    color = data.get("color")

    level = Levels(lvl, xp_required, color)
    level_propreties = level.level_propreties()

    return jsonify({
        "success": True,
        "level_propreties": {
            level_propreties
        }}), 200

@cosmetics_bp.route("/daily", methods=["POST"])
def insert_daily():
    data = request.get_json()
    quest_number = data.get("quest_number")
    quest_difficulty = data.get("quest_difficulty")
    quest_reward = data.get("quest_reward")
    quest_date = date.today()

    daily = DailyQuests(quest_number, quest_difficulty, quest_date, quest_reward)
    daily_propreties = daily.propreties()

    return jsonify({
        "success": True,
        "daily_propreties": {
            daily_propreties
        }}), 200

@cosmetics_bp.route("/title", methods=["POST"])
def insert_title():
    data = request.get_json()
    title = data.get("title")
    level_required = data.get("level_required")
    color = data.get("color")

    title = Titles(title, level_required, color)
    title_propreties = title.propreties()

    return jsonify({
        "success": True,
        "title_propreties": {
            title_propreties
        }}), 200