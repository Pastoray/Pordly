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

class Achievements(db.Model):
    _achievement_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(128), nullable=False)
    difficulty = db.Column(db.String(32), nullable=False)
    xp = db.Column(db.Integer, nullable=False)
    gems = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    def __init__(self, title, difficulty, xp, gems, lives):
        self.title = title
        self.difficulty = difficulty
        self.xp = xp
        self.gems = gems
        self.lives = lives

        db.session.add(self)
        db.session.commit()

class StoryQuests(db.Model):
    _storyquest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    accuracy_req = db.Column(db.Integer, nullable=False)
    wpm_req = db.Column(db.Integer, nullable=False)
    time_req = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(32), nullable=False)
    xp = db.Column(db.Integer, nullable=False)
    gems = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    def __init__(self, title, accuracy_req, wpm_req, time_req, difficulty, xp, gems, lives):
        self.title = title
        self.accuracy_req = accuracy_req 
        self.wpm_req = wpm_req 
        self.time_req = time_req 
        self.difficulty = difficulty
        self.xp = xp
        self.gems = gems
        self.lives = lives

        db.session.add(self)
        db.session.commit()

class DailyQuests(db.Model):
    _dailyquest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    accuracy_req = db.Column(db.Integer, nullable=False)
    wpm_req = db.Column(db.Integer, nullable=False)
    time_req = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(32), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today())
    xp = db.Column(db.Integer, nullable=False)
    gems = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    def __init__(self, title, accuracy_req, wpm_req, time_req, difficulty, date, xp, gems, lives):
        self.title = title
        self.accuracy_req = accuracy_req 
        self.wpm_req = wpm_req 
        self.time_req = time_req 
        self.difficulty = difficulty
        self.date = date
        self.xp = xp
        self.gems = gems
        self.lives = lives

        db.session.add(self)
        db.session.commit()
    
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
    
class Stats(db.Model):
    _stats_id = db.Column(db.Integer, unique=True, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id))
    xp = db.Column(db.Integer)
    level = db.Column(db.Integer, nullable=False) 
    title = db.Column(db.String(64), nullable=False) 
    streak = db.Column(db.Integer, nullable=False)
    gems = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    def __init__(self, user_id, xp, level, title, streak, gems, lives):
        self._user_id = user_id
        self.xp = xp
        self.level = level
        self.title = title
        self.streak = streak
        self.gems = gems
        self.lives = lives

        db.session.add(self)
        db.session.commit()

class UserDailyQuests(db.Model):
    _userdailyquests_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _dailyquest_id = db.Column(db.Integer, db.ForeignKey(DailyQuests._dailyquest_id), nullable=False)
    isComplete = db.Column(db.Boolean, nullable=False)
    def __init__(self, user_id, quest_id, isComplete):
        self._user_id = user_id
        self._dailyquest_id = quest_id
        self.isComplete = isComplete

        db.session.add(self)
        db.session.commit()

class UserStoryQuests(db.Model):
    _userstoryquests_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _storyquest_id = db.Column(db.Integer, db.ForeignKey(StoryQuests._storyquest_id), nullable=False)
    isComplete = db.Column(db.Boolean, nullable=False)
    completionDate =  db.Column(db.Date)
    def __init__(self, user_id, quest_id, isComplete, completionDate):
        self._storyquest_id = quest_id
        self._user_id = user_id
        self.isComplete = isComplete
        self.completionDate = completionDate

        db.session.add(self)
        db.session.commit()
        