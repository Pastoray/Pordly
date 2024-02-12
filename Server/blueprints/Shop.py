from flask import Blueprint, request, jsonify
from blueprints.Stats import *
from database import *

shop_bp = Blueprint("shop", __name__)

@shop_bp.route("/item", methods=["POST"])
def buy_item():
    data = request.get_json()
    user_id = data.get("user_id")
    item_id = data.get("item_id")

    try:
        item = Items.query.filter_by(_item_id=item_id).first()
        user_stats = Stats.query.filter_by(_user_id=user_id).first()
        if item.price <= user_stats.gems:
            UserItems(user_id, item_id)

        return jsonify({"success": True})
    
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
	

@shop_bp.route("/booster", methods=["POST"])
def buy_booster():
    data = request.get_json()
    user_id = data.get("user_id")
    booster_id = data.get("booster_id")

    try:
        booster = Boosters.query.filter_by(_booster_id=booster_id).first()
        user_stats = Stats.query.filter_by(_user_id=user_id).first()
        if booster.price <= user_stats.gems:
          UserBoosters(user_id, booster_id, booster.category, booster.mutiplier, False, None)

        return jsonify({"success": True})
    
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@shop_bp.route("/booster/activate", methods=["POST"])
def buy_booster():
    data = request.get_json()
    user_id = data.get("user_id")
    booster_id = data.get("booster_id")

    try:
          
        user_booster = UserBoosters.query.filter_by(_user_id=user_id, _booster_id=booster_id).first()
        if user_booster and not user_booster.isActive:
            user_booster.isActive = True
            user_booster.expiration_date = date.today() + timedelta(days=7)

        return jsonify({"success": True})
    
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500