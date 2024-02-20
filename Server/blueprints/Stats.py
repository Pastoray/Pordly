from flask import Blueprint, request, jsonify
from database import *
from sqlalchemy.orm.exc import NoResultFound
from datetime import date, timedelta
import calendar

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/gems", methods=["POST"])
def update_gems_route():
	data = request.get_json()
	user_id = data.get("user_id")
	gems = data.get("gems")
	
	try:
		update_gems(user_id, gems)
		return jsonify({"success": True})
	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def update_gems(user_id, gems):
	user_stats = Stats.query.filter_by(_user_id=user_id).first()
	try:							
		delete_outdated_boosters(UserBoosters.query.filter_by(_user_id=user_id, category="gems", isActive=True))			
		user_booster = UserBoosters.query.filter_by(_user_id=user_id, category="gems", isActive=True).order_by(UserBoosters.multiplier.desc(), UserBoosters.expiration_date.desc()).first()
		if user_booster and date.today() <= user_booster.expiration_date:
			user_stats.gems += gems * user_booster.multiplier
		else:
			user_stats.gems += gems
		db.session.commit()
	except NoResultFound:
		return jsonify({"error": f"User with id {user_id} not found"}), 404

	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500
	
	if user_stats.gems >= 10000:
		check_achievement(user_id, 7)
	return {"user_gems": user_stats.gems}

@stats_bp.route("/lives", methods=["POST"])
def decrement_lives():
	data = request.get_json()
	user_id = data.get("user_id")
	lives = data.get("lives")

	return update_lives(user_id, lives)

def update_lives(user_id, lives):
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
		user_stats = Stats.query.filter_by(_user_id=user_id).first()
		delete_outdated_boosters(UserBoosters.query.filter_by(_user_id=user_id, category="xp", isActive=True))
		user_booster = UserBoosters.query.filter_by(_user_id=user_id, category="xp", isActive=True).order_by(UserBoosters.multiplier.desc(), UserBoosters.expiration_date.desc()).first()

		
		if user_booster and date.today() <= user_booster.expiration_date:
			user_stats.xp += xp * user_booster.multiplier
		else:
			user_stats.xp += xp
		db.session.commit()

		user_xp = user_stats.xp

		level_row = Levels.query.filter(Levels.xp_required<=user_xp).order_by(Levels.xp_required.desc()).first()
		level = level_row.level
		
		titles_row = Titles.query.filter(Titles.level_required<=level)
		titles = []
		for t in titles_row:
			title = t.title
			titles.append(title)
		user_stats.level = level
		user_stats.title = titles[0]
		if level == 50:
			check_achievement(user_id, 2)

		db.session.commit()

	except NoResultFound:
		return jsonify({"error": f"User with id {user_id} not found"}), 404

	except Exception as e:
		db.session.rollback()
		return jsonify({"error": f"An error occurred: {str(e)}"}), 500
	
	return jsonify({"user_level": user_stats.level, "user_titles": {f"{i + 1}": v for i, v in enumerate(titles)}})

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
		today_quests.append(UserDailyQuests.query.filter_by(_user_id=user_id, _daily_quest_id=quest._daily_quest_id).first())
	
	if today_quests:
		all_quests_today_completed = all(quest.isComplete for quest in today_quests)
	if all_quests_today_completed:
		user_stats.streak += 1

	db.session.commit()

	current_date = date.today()
	current_year = (int(str(current_date).split("-")[0]))
	current_month = (int(str(current_date).split("-")[1]))
	num_days = calendar.monthrange(current_year, current_month)[1]

	if num_days <= user_stats.streak:
		check_achievement(user_id, 6)

	number_one = Stats.query.order_by(Stats.streak.desc()).first()
	if number_one._user_id == user_id:
		check_achievement(user_id, 1)

def check_achievement(user_id, achievement_id):
	user_achievement = UserAchievements.query.filter_by(_user_id=user_id, _achievement_id=achievement_id).first()

	if user_achievement.isComplete:
		return
	user_achievement.isComplete = True
	user_achievement.completion_date = date.today()
	
	db.session.commit()

	achievement = Achievements.query.filter_by(_achievement_id=achievement_id).first()
	achievement_rewards = achievement.rewards

	update_xp(user_id, achievement_rewards.get("xp"))
	update_gems(user_id, achievement_rewards.get("gems"))
	update_lives(user_id, achievement_rewards.get("lives"))

def delete_outdated_boosters(boosters):
    for booster in boosters:
        if booster.isActive and booster.expiration_date <= date.today():
            db.session.delete(booster)
        db.session.commit()

def get_streak(user_id):
	user_stats = Stats.query.filter_by(_user_id=user_id).first()
	all_quests_yesterday = DailyQuests.query.filter_by(date=date.today() - timedelta(days=1))
	all_quests_yesterday_completed = False
	yesterday_quests = []

	for quest in all_quests_yesterday:
		user_daily_quest = (UserDailyQuests.query.filter_by(_user_id=user_id, _daily_quest_id=quest._daily_quest_id).first())
		if user_daily_quest:
			yesterday_quests.append(user_daily_quest)

	if yesterday_quests:		
		all_quests_yesterday_completed = all(quest.isComplete for quest in yesterday_quests if quest)
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
	
	

