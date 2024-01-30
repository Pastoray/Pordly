from flask import Blueprint, request, jsonify
from database import Stats, db

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/update_lives", methods=["POST"])
def update_lives():
    data = request.get_json()
    user_id = data["id"]
    remove = data["remove"]

    user = Stats.query.filter_by(_user_id=user_id).first()
    user.update_lives(1, remove)


@stats_bp.route("/add_xp", methods=["POST"])
def add_xp():
   data = request.get_json()
   user_id = data["id"]
   xp = data["xp"]

   user = Stats.query.filter_by(_user_id=user_id).first()
   [user_level, user_title] = user.add_xp(xp)

   return jsonify({"user_level": user_level, "user_title": user_title})

@stats_bp.route("/all", methods=["GET"])
def showAll():
   try:
      user = Stats.query.all()
      users_stats = [{
         all_user_stats.level: "level",
         all_user_stats.title: "title",
         all_user_stats.streak: "streak",
         all_user_stats.gems: "gems",
         all_user_stats.lives: "lives"
      } for all_user_stats in user]

      return jsonify({"users_stats": users_stats}), 200
   
   except Exception as e:
      return jsonify({"error": f"Error: {str(e)}"}), 500

@stats_bp.route('/clear', methods=["GET"])
def clearAll():
   try:
      db.session.query(Stats).delete()
      db.session.commit()
      return jsonify({"message": "All records deleted successfully"}), 200
   except Exception as e:
      db.session.rollback()
      return jsonify({"error": f"Error: {str(e)}"}), 500