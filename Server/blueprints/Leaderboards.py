from flask import Blueprint, jsonify
from database import Users, Stats

leaderboards_bp = Blueprint("leaderboards", __name__)

@leaderboards_bp.route("/streak", methods=["GET", "POST"])
def streak_leaderboards():
    top_ten_stats = Stats.query.order_by(Stats.streak.desc()).limit(10).all()
    top_ten = {}
    for user_stats in top_ten_stats:
        user = Users.query.filter_by(_user_id=user_stats._user_id).first()
        username = user.username
        user_streak = user_stats.streak
    
        top_ten[username] = user_streak

    return jsonify({"top_ten": top_ten})

@leaderboards_bp.route("/gems", methods=["GET", "POST"])
def gems_leaderboards():
    top_ten_stats = Stats.query.order_by(Stats.gems.desc()).limit(10).all()
    top_ten = {}
    for user_stats in top_ten_stats:
        user = Users.query.filter_by(_user_id=user_stats._user_id).first()
        username = user.username
        user_gems = user_stats.gems
    
        top_ten[username] = user_gems

    return jsonify({"top_ten": top_ten})

@leaderboards_bp.route("/xp", methods=["GET", "POST"])
def gems_leaderboards():
    top_ten_stats = Stats.query.order_by(Stats.xp.desc()).limit(10).all()
    top_ten = {}
    for user_stats in top_ten_stats:
        user = Users.query.filter_by(_user_id=user_stats._user_id).first()
        username = user.username
        user_xp = user_stats.xp
    
        top_ten[username] = user_xp

    return jsonify({"top_ten": top_ten})