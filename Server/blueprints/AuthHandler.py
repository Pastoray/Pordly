from flask import Blueprint, request, jsonify, make_response
from database import Users
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta

auth_bp = Blueprint("auth_bp", __name__)
jwt = JWTManager()

@auth_bp.route("/loadAccount", methods=["POST"])
def load_account():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": {
                "emailError": "Invalid Data",
                "passwordError": "Invalid Data",
            }
        }), 400
    
    email = data.get("email")
    password = data.get("password")

    if not (password and email):
        return jsonify({
            "success": False,
            "error": {
                "emailError": "Missing email" if not email else "",
                "passwordError": "Missing password" if not password else ""
            }
        }), 400
    
    user = Users.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({
                "success": False,
                "error": {
                    "emailError": "User doesn't exist",
                    "passwordError": "User doesn't exist"
                }
            }), 400
    else:
        if not user.check_password(password):
            return jsonify({
                "success": False,
                "error": {
                    "passwordError": "Wrong password"
                }
            }), 401

    expires = timedelta(days=30)
    accessToken = create_access_token(identity=user._user_id, expires_delta=expires)

    response = make_response(jsonify({
        "success": True,
        "accessToken": accessToken,
        "message": "Logged in successfully"
    }), 200)

    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response



@auth_bp.route('/validateToken', methods=["GET"])
@jwt_required()
def validate_token():
    user_id = get_jwt_identity()
    user = Users.query.filter_by(_user_id=user_id).first()
    
    return jsonify({
        "success": (user_id != None),
        "id": user_id,
        "username": user.username
    }), 200
