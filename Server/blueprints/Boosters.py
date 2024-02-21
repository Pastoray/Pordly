from flask import Blueprint, request, jsonify
from blueprints.Stats import check_achievement, delete_outdated_boosters
from database import *
from datetime import date, timedelta

boosters_bp = Blueprint("boosters", __name__)

@boosters_bp.route("/buy", methods=["POST"])
def buy_booster():
    data = request.get_json()
    user_id = data.get("user_id")
    booster_id = data.get("booster_id")

    try:
        booster = Boosters.query.filter_by(_booster_id=booster_id).first()
        user_stats = Stats.query.filter_by(_user_id=user_id).first()
        if booster.price <= user_stats.gems:
            user_stats.gems -= booster.price
            check_achievement(user_id, 8)
            UserBoosters(user_id, booster_id, booster.category, booster.multiplier, False, None)
            
        db.session.commit()

        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500

@boosters_bp.route("/activate", methods=["POST"])
def activate_booster():
    data = request.get_json()
    user_booster_id = data.get("booster_id")

    try:
        user_booster = UserBoosters.query.filter_by(_user_boosters_id=user_booster_id).first()
        if user_booster and not user_booster.isActive:
            user_booster.isActive = True
            if user_booster.category == "xp":
                user_booster.expiration_date = date.today() + timedelta(days=14)
            else:
                user_booster.expiration_date = date.today() + timedelta(days=7)
            db.session.commit()

        return jsonify({"success": True})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@boosters_bp.route("/fetch", methods=["POST"])
def fetch_boosters():
    data = request.get_json()
    user_id = data.get("user_id")
    boosters = []
    try:
        delete_outdated_boosters(UserBoosters.query.filter_by(_user_id=user_id))
        user_boosters = UserBoosters.query.filter_by(_user_id=user_id)

        for user_booster in user_boosters:
            booster = Boosters.query.filter_by(_booster_id=user_booster._booster_id).first()
            boosters.append({
                "user_booster_id": user_booster._user_boosters_id,
                "user_id": user_booster._user_id,
                "booster_id": user_booster._booster_id,
                "title": booster.title,
                "description": booster.description,
                "color": booster.color,
                "category": user_booster.category,
                "multiplier": user_booster.multiplier,
                "isActive": user_booster.isActive,
                "expiration_date": user_booster.expiration_date
            })
        return jsonify(boosters)
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
