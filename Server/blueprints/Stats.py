from flask import Blueprint, request, jsonify
from database import *
from sqlalchemy.orm.exc import NoResultFound
from datetime import date, timedelta

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/test")
def test():
	try:
		user = Users("test", "test@gmail.com", "test")
		user_id = user._user_id

		row = Titles.query.filter(Titles.level_required<=1).first()
		title = row.title
		Stats(user_id, 0, 1, title, 0, 100, 5)
	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500
	return jsonify({"user_created": True, "user_id": user_id})

def update_gems(user_id, gems):
	try:
		user_stats = Stats.query.filter_by(_user_id=user_id).first()
		user_stats.gems += gems
		db.session.commit()
	except NoResultFound:
		return jsonify({"error": f"User with id {user_id} not found"}), 404

	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500
	return {"user_gems": user_stats.gems}

@stats_bp.route("/lives", methods=["POST"])
def update_lives():
	data = request.get_json()
	user_id = data.get("user_id")
	lives = data.get("lives")

	try:
		user_stats = Stats.query.filter_by(_user_id=user_id).first()
		user_stats.lives += lives
		db.session.commit()
	except NoResultFound:
		return jsonify({"error": f"User with id {user_id} not found"}), 404

	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500
	return {"user_lives": user_stats.lives}

def update_xp(user_id, xp):
	try:
		user = Stats.query.filter_by(_user_id=user_id).first()
		user.xp += xp

		db.session.commit()
		user_xp = user.xp

		level_row = Levels.query.filter_by(xp_required=user_xp).first()
		level = level_row.level
		
		titles_row = Titles.query.filter(Titles.level_required<=level)
		titles = []
		for t in titles_row:
			title = t.title
			titles.append(title)
		user.level = level
		user.title = titles[0]

		db.session.commit()

	except NoResultFound:
		return jsonify({"error": f"User with id {user_id} not found"}), 404

	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500
	
	return jsonify({"user_level": user.level, "user_titles": {f"{i + 1}": v for i, v in enumerate(titles)}})

def reset_daily_lives(user_id):
	user_stats = Stats.query.filter_by(_user_id=user_id).first()
	lives = max(user_stats.lives, 5)

	user_stats.lives = lives
	db.session.commit()

def update_streak(user_id):
	user_stats = Stats.query.filter_by(_user_id=user_id).first()
	all_quests_today = DailyQuests.query.filter_by(date=date.today())
	all_quests_today_completed = False

	today_quests = []
	
	for quest in all_quests_today:
		today_quests.append(UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest._dailyquest_id).first())
	
	if today_quests:
		all_quests_today_completed = all(quest.isComplete for quest in today_quests)
	if all_quests_today_completed:
		user_stats.streak += 1

	db.session.commit()

def get_streak(user_id):
	user_stats = Stats.query.filter_by(_user_id=user_id).first()
	all_quests_yesterday = DailyQuests.query.filter_by(date=date.today() - timedelta(days=1))
	all_quests_yesterday_completed = False

	yesterday_quests = []

	for quest in all_quests_yesterday:
		yesterday_quests.append(UserDailyQuests.query.filter_by(_user_id=user_id, _dailyquest_id=quest._dailyquest_id).first())

	if yesterday_quests:
		all_quests_yesterday_completed = all(quest.isComplete for quest in yesterday_quests)
	if not all_quests_yesterday_completed:
		user_stats.streak = 0
		db.session.commit()
		update_streak(user_id)


@stats_bp.route("/user", methods=["POST"])
def show_user_stats():
	data = request.get_json()
	user_id = data.get("id")
	try:
		user_stats = Stats.query.filter_by(_user_id=user_id).first()
		return jsonify({
			"user_id": user_stats._user_id,
			"xp": user_stats.xp,
			"level": user_stats.level,
			"title": user_stats.title,
			"streak": user_stats.streak,
			"gems": user_stats.gems,
			"lives": user_stats.lives
		})
	
	except Exception as e:
		return jsonify({"error": f"Error: {str(e)}"}), 500
	
