from flask import Blueprint, request, jsonify
from database import *
from datetime import date, timedelta
from blueprints.Stats import reset_daily_lives
from utils.DeafaultValues import *
import json

create_bp = Blueprint("create", __name__)

def create_user_stats(user_id):
    Stats(user_id, 0, 0, 100, 5)

@create_bp.route("/levels", methods=["POST", "GET"])
def create_levels():
    levels = []
    if request.method == "POST":
        levels = request.get_json()
        for entry in levels:
            level = entry.get("level")
            xp_required = entry.get("xp_required")
            color = entry.get("color")

            Levels(level, xp_required, color)
    else:
        levels = default_levels
        for entry in levels:
            level = entry.get("level")
            xp_required = entry.get("xp_required")
            color = entry.get("color")

            Levels(level, xp_required, color)
    return jsonify(levels), 201

@create_bp.route("/titles", methods=["POST", "GET"])
def create_titles():
    titles = []
    if request.method == "POST":
        titles = request.get_json()
        for entry in titles:
            title = entry.get("title")
            level_required = entry.get("level_required")
            color = entry.get("color")

            Titles(title, level_required, color)
    else:
        titles = default_titles
        for entry in titles:
            title = entry.get("title")
            level_required = entry.get("level_required")
            color = entry.get("color")

            Titles(title, level_required, color)
    return jsonify(titles), 201

@create_bp.route("/daily-quests", methods=["GET", "POST"])
def create_daily_quests():
    entries = []
    if request.method == "POST":
        entries = request.get_json()
        for entry in entries:
            title = entry.get("title")
            difficulty = entry.get("difficulty")
            quest_date = entry.get("date")
            paras = entry.get("paras")
            requirements = entry.get("requirements")
            rewards = entry.get("rewards")

            date_object = quest_date.split("-")
            quest_date = date(int(date_object[0]), int(date_object[1]), int(date_object[2]))
            
            DailyQuests(title, requirements, paras, difficulty, quest_date, rewards)
    else:
        entries = default_daily_quests

        last_daily_quests = DailyQuests.query.order_by(DailyQuests.date.desc()).first()
        for entry in entries:
            title = entry.get("title")
            difficulty = entry.get("difficulty")
            paras = entry.get("paras")
            requirements = entry.get("requirements")
            rewards = entry.get("rewards")

            quest_date = date.today()

            if last_daily_quests:
                quest_date = max(last_daily_quests.date + timedelta(days=1), date.today())
            
            DailyQuests(title, requirements, paras, difficulty, quest_date, rewards)

    return jsonify(entries), 201

def create_user_daily_quests(user_id):
    lives_reset = False
    entries = DailyQuests.query.filter_by(date=date.today())
    quests = []
    for entry in entries:
        quests.append({
            "daily_quest_id": entry._daily_quest_id,
            "title": entry.title,
            "requirements": entry.requirements,
            "difficulty": entry.difficulty,
            "date": entry.date,
            "rewards": entry.rewards
        })
        quest_id = entry._daily_quest_id
        quest_in_table = UserDailyQuests.query.filter_by(_user_id=user_id, _daily_quest_id=quest_id).first()
        if not quest_in_table:
            UserDailyQuests(user_id, quest_id, False)
            lives_reset = True
    
    if lives_reset:
        reset_daily_lives(user_id)

    return quests

def create_user_story_quests(user_id):
    entries = StoryQuests.query.all()
    quests = []

    for entry in entries:
        quests.append({
            "_story_quest_id": entry._story_quest_id, 
            "title": entry.title,
            "requirements": entry.requirements,
            "paras": entry.paras,
            "difficulty": entry.difficulty,
            "rewards": entry.rewards
        })
        quest_id = entry._story_quest_id
        UserStoryQuests(user_id, quest_id, False, None)

    return quests

@create_bp.route("/story-quests", methods=["POST", "GET"])
def create_story_quests():
    entries = []
    if request.method == "POST":
        entries = request.get_json() 
        for entry in entries:
            requirements = json.dumps(entry.get("requirements"))
            rewards = json.dumps(entry.get("rewards"))

            StoryQuests(entry.get("title"), requirements, entry.get("paras"), entry.get("difficulty"), rewards)
    else:
        entries = default_story_quests
        for entry in entries:
            StoryQuests(entry.get("title"), entry.get("requirements"), entry.get("paras"), entry.get("difficulty"), entry.get("rewards"))

    return jsonify({"entries": entries}), 201

def create_user_achievements(user_id):
    entries = Achievements.query.all()
    quests = []

    for entry in entries:
        quests.append({
            "_achievement_id": entry._achievement_id, 
            "title": entry.title,
            "description": entry.description,
            "difficulty": entry.difficulty,
            "rewards": entry.rewards
        })
        achievement_id = entry._achievement_id
        UserAchievements(user_id, achievement_id, False, None)

    return quests

@create_bp.route("/achievements", methods=["POST", "GET"])
def create_achievements():
    entries = []
    if request.method == "POST":
        entries = request.get_json()
        for entry in entries:
            
            Achievements(entry.get("title"), entry.get("description"), entry.get("difficulty"), entry.get("rewards"))
    else:
        entries = default_achievements
        for entry in entries:
            Achievements(entry.get("title"), entry.get("description"), entry.get("difficulty"), entry.get("rewards"))

    return jsonify({"entries": entries}), 201
    
@create_bp.route("/boosters", methods=["POST", "GET"])
def create_boosters():
    entries = []
    if request.method == "POST":
        entries = request.get_json()
        for entry in entries:
            Boosters(entry.get("title"), entry.get("description"), entry.get("price"), entry.get("category"), entry.get("multiplier"), entry.get("color"))

    else:
        entries = default_boosters
        for entry in entries:
            Boosters(entry.get("title"), entry.get("description"), entry.get("price"), entry.get("category"), entry.get("multiplier"), entry.get("color"))

    return jsonify({"entries": entries}), 201

def create_user_boosters(user_id):
    entries = Boosters.entries.all()
    boosters = []

    for entry in entries:
        boosters.append(
            {
                "user_id": entry._user_id,
                "booster_id": entry._booster_id,
                "category": entry.category,
                "multiplier": entry.multiplier,
                "isActive": entry.isActive,
                "expiration_date": entry.expiration_date
            }
        )
        UserBoosters(user_id, entry._booster_id, entry.category, entry.multiplier, False, None)

    return boosters


