from flask import Blueprint, request, jsonify

# from database import UserAchievements, Achievements, db

achivements_bp = Blueprint("achivements", __name__)

# @achivements_bp.route("/insert", methods=["POST"])
# def insert_achievement():
#     data = request.get_json()
#     for achievement in data:
#         title = achievement["title"]
#         description = achievement["description"]
#         reward = achievement["reward"]

#         instance = Achievements(title, description, reward)
#         db.session.add(instance)
#         db.session.commit()
#     return "Achievement Inserted.", 200

# @achivements_bp.route("/show", methods=["POST", "GET"])
# def show_achievements():
#     data = Achievements.query.all()
#     if request.method == "GET":
#         obj = {}
#         for i in range(len(data)):
#             obj[f"Achivement {i + 1}"] = {"title": data[i].title, "description": data[i].description, "reward": data[i].reward}
#         return jsonify(obj), 200
#     else:
#         jsonID = request.get_json()
#         id = jsonID.get("id")
#         if id is not None and 0 <= id < len(data):
#             achievement = data[id]
#             return jsonify({f"Achivement {id + 1}": {"title": achievement.title, "description": achievement.description, "reward": achievement.reward}}), 200
#         else:
#             return jsonify({"message": "Invalid ID"}), 400

# @achivements_bp.route("/clear")
# def clear_achivements():
#     try:
#         db.session.query(Achievements).delete()
#         db.session.commit()
#         return jsonify({"message": "All records deleted successfully"}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Error: {str(e)}"}), 500