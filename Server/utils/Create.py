from flask import Blueprint, request, jsonify
from database import *
from datetime import date
from blueprints.Stats import reset_daily_lives
import json

create_bp = Blueprint("create", __name__)

def create_stats(user_id):
    row = Titles.query.filter(Titles.level_required<=1).first()
    title = row.title
    Stats(user_id, 0, 1, title, 0, 100, 5)

@create_bp.route("/levels", methods=["POST"])
def create_levels():
    data = request.get_json()
    levels = []
    for entry in data:
        level = entry.get("level")
        xp_required = entry.get("xp_required")
        color = entry.get("color")

        Levels(level, xp_required, color)
        levels.append({
            "level": level,
            "xp_required": xp_required,
            "color": color
        })
    return jsonify(levels), 201

@create_bp.route("/titles", methods=["POST"])
def create_titles():
    data = request.get_json()
    titles = []
    for entry in data:
        title = entry.get("title")
        level_required = entry.get("level_required")
        color = entry.get("color")

        Titles(title, level_required, color)
        titles.append({
            "title": title,
            "level_required": level_required,
            "color": color
        })
    return jsonify(titles), 201

@create_bp.route("/daily-quests", methods=["POST"])
def create_daily_quests():
    data = request.get_json()
    quests = []
    for entry in data:
        title = entry.get("title")
        difficulty = entry.get("difficulty")
        quest_date = entry.get("date")
        paras = entry.get("paragraphs")
        requirements = entry.get("requirements")
        rewards = entry.get("rewards")

        date_object = quest_date.split("-")

        quest_date = date(int(date_object[0]), int(date_object[1]), int(date_object[2]))


        DailyQuests(title, requirements, paras, difficulty, quest_date, rewards)

        quests.append({
            "title": title,
            "requirements": requirements,
            "difficulty": difficulty,
            "date": quest_date,
            "rewards": rewards
        })
    return jsonify(quests), 201

def create_user_daily_quests(user_id):
    lives_reset = False
    entries = DailyQuests.query.filter_by(date=date.today())
    quests = []

    for entry in entries:
        quests.append({
            "title": entry.title,
            "requirements": entry.requirements,
            "difficulty": entry.difficulty,
            "date": entry.date,
            "rewards": entry.rewards
        })
        quest_id = entry._dailyquest_id
        quest_in_table = UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest_id).first()
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
            "_user_id": entry._user_id,
            "isComplete": entry.isComplete,
            "completionDate": entry.completionDate,
        })
        quest_id = entry._dailyquest_id
        UserStoryQuests(user_id, quest_id, False, None)

    return quests

@create_bp.route("/story-quests")
def create_story_quests():
    entries = []
    for i in range(1, 8):
        entry = {
            "title": f"Quest {i}",
            "requirements": {
                "accuracy": 5 * i,
                "wpm": 4 * i,
                "time": 240 - i * 10 
            },
            "paras": i // 3,
            "difficulty": "Easy",
            "rewards": {
                "xp": 15 * i,
                "gems": 10 * i,
                "lives": 0
            }   
        }
        entries.append(entry)

        requirements = json.dumps(entry.get("requirements"))
        rewards = json.dumps(entry.get("rewards"))

        StoryQuests(entry.get("title"), requirements, entry.get("paras"), entry.get("difficulty"), rewards)

    for i in range(8, 15):
        entry = {
            "title": f"Quest {i}",
            "requirements": {
                "accuracy": 5 * i,
                "wpm": 4 * i,
                "time": 160 - i * 5
            },
            "paras": i // 3,
            "difficulty": "Medium",
            "rewards": {
                "xp": 20 * i,
                "gems": 15 * i,
                "lives": 0
            }   
        }
        entries.append(entry)

        requirements = json.dumps(entry.get("requirements"))
        rewards = json.dumps(entry.get("rewards"))

        StoryQuests(entry.get("title"), requirements, entry.get("paras"), entry.get("difficulty"), rewards)

    for i in range(15, 21):
        entry = {
            "title": f"Quest {i}",
            "requirements": {
                "accuracy": 5 * i,
                "wpm": 4 * i,
                "time": 30 - ((i > 18) * 15) 
            },
            "paras": i // 3,
            "difficulty": "Hard",
            "rewards": {
                "xp": 25 * i,
                "gems": 15 * i,
                "lives": 1
            }   
        }
        entries.append(entry)

        requirements = json.dumps(entry.get("requirements"))
        rewards = json.dumps(entry.get("rewards"))

        StoryQuests(entry.get("title"), requirements, entry.get("paras"), entry.get("difficulty"), rewards)

    return jsonify({"entries": entries}), 201
    