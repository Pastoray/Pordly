from flask import Blueprint, jsonify
from database import *

leaderboards_bp = Blueprint("leaderboards", __name__)

@leaderboards_bp.route("/streak", methods=["GET", "POST"])
def streak_leaderboards():
    top_ten_stats = Stats.query.order_by(Stats.streak.desc(), Stats.xp.desc(), Stats.gems.desc()).limit(50).all()
    top_ten = []
    for user_stats in top_ten_stats:
        user = Users.query.filter_by(_user_id=user_stats._user_id).first()
        username = user.username
        user_id = user._user_id
        
        user_level = Levels.query.filter(Levels.xp_required<=user_stats.xp).order_by(Levels.xp_required.desc()).first()
        user_title = Titles.query.filter(Titles.level_required<=user_level.level).order_by(Titles.level_required.desc()).first()

        top_ten.append({
            "info": {
                "user_id": user_id, 
                "username": username
            },
            "stats": {              
                "xp": user_stats.xp,
                "streak": user_stats.streak,
                "gems": user_stats.gems,
                "lives": user_stats.lives,
                "level": {
                    "level_id": user_level._level_id,
                    "level": user_level.level,
                    "xp_required": user_level.xp_required,
                    "color": user_level.color
                },
                "title": {
                    "title_id": user_title._title_id,
                    "title": user_title.title,
                    "level_required": user_title.level_required,
                    "color": user_title.color
                }
            }
        })

    return jsonify(top_ten)

@leaderboards_bp.route("/gems", methods=["GET", "POST"])
def gems_leaderboards():
    top_ten_stats = Stats.query.order_by(Stats.gems.desc(), Stats.xp.desc(), Stats.streak.desc()).limit(50).all()
    top_ten = []
    for user_stats in top_ten_stats:
        user = Users.query.filter_by(_user_id=user_stats._user_id).first()
        username = user.username
        user_id = user._user_id
        
        user_level = Levels.query.filter(Levels.xp_required<=user_stats.xp).order_by(Levels.xp_required.desc()).first()
        user_title = Titles.query.filter(Titles.level_required<=user_level.level).order_by(Titles.level_required.desc()).first()
        
        top_ten.append({
            "info": {
                "user_id": user_id, 
                "username": username
            },
            "stats": {              
                "xp": user_stats.xp,
                "streak": user_stats.streak,
                "gems": user_stats.gems,
                "lives": user_stats.lives,
                "level": {
                    "level_id": user_level._level_id,
                    "level": user_level.level,
                    "xp_required": user_level.xp_required,
                    "color": user_level.color
                },
                "title": {
                    "title_id": user_title._title_id,
                    "title": user_title.title,
                    "level_required": user_title.level_required,
                    "color": user_title.color
                }
            }
        })

    return jsonify(top_ten)
    
@leaderboards_bp.route("/xp", methods=["GET", "POST"])
def xp_leaderboards():
    top_ten_stats = Stats.query.order_by(Stats.xp.desc(), Stats.gems.desc(), Stats.streak.desc()).limit(50).all()
    top_ten = []
    for user_stats in top_ten_stats:
        user = Users.query.filter_by(_user_id=user_stats._user_id).first()
        username = user.username
        user_id = user._user_id
        
        user_level = Levels.query.filter(Levels.xp_required<=user_stats.xp).order_by(Levels.xp_required.desc()).first()
        user_title = Titles.query.filter(Titles.level_required<=user_level.level).order_by(Titles.level_required.desc()).first()
        
        top_ten.append({
            "info": {
                "user_id": user_id, 
                "username": username
            },
            "stats": {              
                "xp": user_stats.xp,
                "streak": user_stats.streak,
                "gems": user_stats.gems,
                "lives": user_stats.lives,
                "level": {
                    "level_id": user_level._level_id,
                    "level": user_level.level,
                    "xp_required": user_level.xp_required,
                    "color": user_level.color
                },
                "title": {
                    "title_id": user_title._title_id,
                    "title": user_title.title,
                    "level_required": user_title.level_required,
                    "color": user_title.color
                }
            }
        })

    return jsonify(top_ten)