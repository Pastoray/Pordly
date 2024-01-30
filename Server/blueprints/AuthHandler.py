from flask import Blueprint, request, jsonify, make_response
from database import db, Users
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta

auth_bp = Blueprint("auth_bp", __name__)
jwt = JWTManager()

@auth_bp.route("/createAccount", methods=["POST"])
def createAccount():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": {
                "usernameError": "Invalid Data",
                "emailError": "Invalid Data",
                "passwordError": "Invalid Data",
            }
        }), 400
    
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not (password and email and username):
        return jsonify({"success": False, "error": {
            "usernameError": "Missing username" if not username else "",                                   
            "emailError": "Missing email" if not email else "",
            "passwordError": "Missing password" if not password else ""
            }
        }), 400
    
    usernameExists = Users.query.filter_by(username=username).first()
    emailExists = Users.query.filter_by(email=email).first()
    
    if usernameExists:
        return jsonify({"success": False, "error": {"usernameError": "Username already exists"}}), 400
    elif emailExists:
        return jsonify({"success": False, "error": {"emailError": "Email already exists"}}), 400

    user = Users(username, email, password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "Account Created successfully"}), 201


@auth_bp.route("/loadAccount", methods=["POST"])
def loadAccount():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": {
                "emailError": "Invalid Data",
                "passwordError": "Invalid Data",
            }}), 400
    
    email = data.get("email")
    password = data.get("password")

    if not (password and email):
        return jsonify({"success": False, "error": {
            "emailError": "Missing email" if not email else "",
            "passwordError": "Missing password" if not password else ""
            }}), 400
    
    user = Users.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"success": False, "error": {
            "emailError": "User doesn't exist",
            "passwordError": "User doesn't exist"
            }}), 400
    else:
        if not user.check_password(password):
            return jsonify({"success": False, "error": {
                "passwordError": "Wrong password"
            }}), 401

    expires = timedelta(days=30)
    accessToken = create_access_token(identity=user._id, expires_delta=expires)

    response = make_response(jsonify({"success": True, "accessToken": accessToken, "message": "Logged in successfully"}), 200)

    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response



@auth_bp.route('/verifyToken', methods=["GET"])
@jwt_required()
def verifyToken():
    current_user = get_jwt_identity()

    user = Users.query.filter_by(_id=current_user).first()
    return jsonify({"success": (current_user != None), "id": current_user, "username": user.username}), 200


@auth_bp.route('/all', methods=["GET"])
def showAll():
    try:
        all_users = Users.query.all()
        users_list = [{"username": user.username, "email": user.email, "password": user.password} for user in all_users]

        return jsonify({"users": users_list}), 200
    
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500


@auth_bp.route('/clear', methods=["GET"])
def clearAll():
    try:
        db.session.query(Users).delete()
        db.session.commit()
        return jsonify({"message": "All records deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error: {str(e)}"}), 500
