from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date

db = SQLAlchemy()

class Levels(db.Model):
    _level_id = db.Column(db.Integer, nullable=False, primary_key=True)
    level = db.Column(db.Integer, nullable=False)
    xp_required = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(32), nullable=False)
    def __init__(self, level, xp_required, color):
        self.level = level
        self.xp_required = xp_required
        self.color = color

        db.session.add(self)
        db.session.commit()
    
    def get_properties(self):
        return {
            "level_id": self._level_id,
            "level": self.level,
            "xp_required": self.xp_required,
            "color": self.color
        }

class DailyQuests(db.Model):
    _dailyquest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(128), nullable=False)
    difficulty = db.Column(db.String(32), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today())
    gems = db.Column(db.Integer, nullable=False)
    xp = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    def __init__(self, title, description, difficulty, date, gems, xp, lives):
        self.title = title
        self.description = description
        self.difficulty = difficulty
        self.date = date
        self.gems = gems
        self.xp = xp
        self.lives = lives

        db.session.add(self)
        db.session.commit()

    def properties(self):
        return {
            "daily_quest_id": self._dailyquest_id,
            "title": self.title,
            "description": self.description,
            "difficulty": self.difficulty,
            "date": self.date,
            "gems": self.gems,
            "xp": self.xp,
            "lives": self.lives
        }
    
class Titles(db.Model):
    _title_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    level_required = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(64), nullable=False)
    def __init__(self, title, level_required, color):
        self.title = title
        self.level_required = level_required
        self.color = color
        
        db.session.add(self)
        db.session.commit()

    def propreties(self):
        return {
            "title_id": self._title_id,
            "title": self.title,
            "level_required": self.level_required,
            "color": self.color
        }

class Users(db.Model):
    _user_id = db.Column(db.Integer, unique=True, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.hashed_password = generate_password_hash(password)

        db.session.add(self)
        db.session.commit()

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)
    
    def properties(self):
        return {
            "user_id": self._user_id,
            "username": self.username,
            "email": self.email,
            "hashed_password": self.hashed_password
        }
    
class Stats(db.Model):
    _stats_id = db.Column(db.Integer, unique=True, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id))
    xp = db.Column(db.Integer)
    level = db.Column(db.Integer, nullable=False) 
    title = db.Column(db.String(64), nullable=False) 
    streak = db.Column(db.Integer, nullable=False)
    gems = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    def __init__(self, user_id, xp, level, title, streak, gems, lives, last_update):
        self._user_id = user_id
        self.xp = xp
        self.level = level
        self.title = title
        self.streak = streak
        self.gems = gems
        self.lives = lives

        db.session.add(self)
        db.session.commit()

    def properties(self):
        return {
            "stats_id": self._stats_id,
            "user_id": self._user_id,
            "xp": self.xp,
            "level": self.level,
            "title": self.title,
            "streak": self.streak,
            "gems": self.gems,
            "lives": self.lives
        }

class UserDailyQuests(db.Model):
    _userdailyquests_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _dailyquest_id = db.Column(db.Integer, db.ForeignKey(DailyQuests._dailyquest_id), nullable=False)
    date = db.Column(db.Date, db.ForeignKey(DailyQuests.date))
    isComplete = db.Column(db.Boolean, nullable=False)
    def __init__(self, user_id, quest_id, isComplete, date):
        self.user_id = user_id
        self.quest_id = quest_id
        self.isComplete = isComplete
        self.date = date

        db.session.add(self)
        db.session.commit()

    def properties(self):
        return {
            "user_daily_quests_id": self._userdailyquests_id,
            "user_id": self._user_id,
            "daily_quest_id": self._dailyquest_id,
            "isComplete": self.isComplete,
            "date": self.date
        }