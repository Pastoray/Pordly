from flask import Blueprint, request, jsonify
from database import *
from sqlalchemy.orm.exc import NoResultFound
from datetime import date

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/test")
def test():
	user = Users("test", "test@gmail.com", "test")
	user_id = user._user_id
	return jsonify({"user_created": True, "user_id": user_id})

@stats_bp.route("/gems", methods=["POST"])
def update_gems(user_id, gems):
	data = request.get_json()
	user_id = data.get("user_id")
	gems = data.get("gems")

	try:
		user_stats = Stats.query.filter_by(_user_id=user_id).first()
		user_stats.gems = user_stats.gems + gems
		db.session.commit()
	except NoResultFound:
		return jsonify({"error": f"User with id {user_id} not found"}), 404

	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@stats_bp.route("/lives", methods=["POST"])
def update_lives(user_id, lives):
	data = request.get_json()
	user_id = data.get("user_id")
	lives = data.get("lives")

	user = Users.query.filter_by(_user_id=user_id).first()
	#user.update_lives(lives, )
	# UPDATE THIS FILE TOMMOROW
	db.session.commit()

@stats_bp.route("/xp", methods=["POST"])
def update_xp(user_id, xp):
	data = request.get_json()
	user_id = data.get("user_id")
	xp = data.get("xp")

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
	return jsonify({"user_level": user.level, "user_titles": {f"{i + 1}": v for i, v in enumerate(titles)}})

@stats_bp.route("/streak", methods=["POST"])
def update_streak(user_id):
	data = request.get_json()
	user_id = data.get("user_id")

	streak = 0
	all_quests_completed_yesterday = False
	yesterday_quests = UserDailyQuests.query.filter_by(_user_id=user_id, date=date.today() - 1)
	if yesterday_quests:
		all_quests_completed_yesterday = all(quest.isComplete for quest in yesterday_quests)
	else:
		all_quests_completed_yesterday = True
	  
	if all_quests_completed_yesterday:
		yesterday_streak = Stats.query.filter_by(_user_id=user_id).streak
		streak = yesterday_streak
	
	today_quests = UserDailyQuests.query.filter_by(_user_id=user_id, date=date.today())
	all_quests_completed_today = all(quest.isComplete for quest in today_quests)

	if all_quests_completed_today:
		streak += 1

	user_stats = Stats.query.filter_by(_user_id=user_id).first()
	user_stats.streak = streak
	
	db.session.commit()

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
