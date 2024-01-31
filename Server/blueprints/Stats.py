from flask import Blueprint, request, jsonify
from database import Stats, Users, db

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/test", methods=["GET"])
def test():
   user = Users("test", "test@gmail.com", "test")
   user_id = user._user_id
   user_stats = user.stats.get_stats()
   return jsonify({"user_created": True, "user_id": user_id, "user_stats": user_stats})

@stats_bp.route("/update_streak", methods=["POST"])
def update_streak():
    data = request.get_json()
    user_id = data.get("id")
    reset = data.get("reset")

    user = Users.query.filter_by(_user_id=user_id).first()
    user.stats.update_streak(1, reset)

@stats_bp.route("/update_gems", methods=["POST"])
def update_gems():
    data = request.get_json()
    user_id = data.get("id")
    gems = data.get("gems")
    remove = data.get("remove")

    user = Users.query.filter_by(_user_id=user_id).first()
    user.stats.update_gems(gems, remove)

@stats_bp.route("/update_lives", methods=["POST"])
def update_lives():
    data = request.get_json()
    user_id = data.get("id")
    remove = data.get("remove")

    user = Users.query.filter_by(_user_id=user_id).first()
    user.update_lives(1, remove)



@stats_bp.route("/add_xp", methods=["POST"])
def add_xp():
   data = request.get_json()
   user_id = data.get("id")
   xp = data.get("xp")

   user = Stats.query.filter_by(_user_id=user_id).first()
   [user_level, user_title] = user.add_xp(xp)

   return jsonify({"user_level": user_level, "user_title": user_title})

@stats_bp.route("/user", methods=["POST"])
def show_user_stats():
   data = request.get_json()
   user_id = data.get("id")
   try:
      user = Users.query.join(Stats).filter_by(_user_id=user_id).first()
      stats = user.stats.get_stats()
      return jsonify({"stats": stats})
   except Exception as e:
      return jsonify({"error": f"Error: {str(e)}"}), 500

@stats_bp.route("/all", methods=["GET"])
def show_all():
   try:
      stats = Stats.query.all()
      users_stats = [{
         "user_id": stat._user_id,
         "level": stat.level,
         "title": stat.title,
         "streak": stat.streak,
         "gems": stat.gems,
         "lives": stat.lives
      } for stat in stats]

      return jsonify({"users_stats": users_stats}), 200
   
   except Exception as e:
      return jsonify({"error": f"Error: {str(e)}"}), 500

@stats_bp.route('/clear', methods=["GET"])
def clear_all():
   try:
      db.session.query(Stats).delete()
      db.session.commit()
      return jsonify({"message": "All records deleted successfully"}), 200
   except Exception as e:
      db.session.rollback()
      return jsonify({"error": f"Error: {str(e)}"}), 500