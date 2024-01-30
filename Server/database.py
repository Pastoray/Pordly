from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date

db = SQLAlchemy()

class Users(db.Model):
    _user_id = db.Column(db.Integer, unique=True, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)

class DailyQuests(db.Model):
    _dailyquest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    quest_number = db.Column(db.Integer, nullable=False)
    quest_difficulty = db.Column(db.String(30), nullable=False)
    quest_date = db.Column(db.Date, nullable=False, default=date.today())
    quest_reward = db.Column(db.Integer, nullable=False)
    def __init__(self, quest_number, quest_difficulty):
        self.quest_number = quest_number
        self.quest_difficulty = quest_difficulty

class UserDailyQuests(db.Model):
    _userdailyquests_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _dailyquest_id = db.Column(db.Integer, db.ForeignKey(DailyQuests._dailyquest_id), nullable=False)
    dailyquest_number = db.Column(db.Integer, db.ForeignKey(DailyQuests.quest_number), nullable=False)
    isComplete = db.Column(db.Boolean, nullable=False, default=False)
    def __init__(self, user_id, dailyquest_number, isComplete=False):
        self.user_id = user_id
        self.dailyquest_number = dailyquest_number
        self.isComplete = isComplete

    @classmethod
    def complete_quest(cls, user_id, daily_quest_number):
        entries = cls.query.filter_by(_user_id=user_id, quest_date=date.today())
        entry = entries.filter_by(quest_number=daily_quest_number, isComplete=False).first()
        user = Users.query.filter_by(_user_id=user_id)
        if entry:
            entry.isComplete = True
            reward = DailyQuests.query.filter_by(quest_number=daily_quest_number).first().quest_reward
            user.update_gems(reward)
            db.session.commit()
            if entries.order_by(isComplete.asc()).first().isComplete:
                user.update_streak()

class Titles(db.Model):
    _title_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(60), nullable=False)
    level_required = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(60), nullable=False)
    def __init__(self, title, level_required, color):
        self.title = title
        self.level_required = level_required
        self.color = color

class Stats(db.Model):
    _stats_id = db.Column(db.Integer, unique=True, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id))
    xp = db.Column(db.Integer)
    level = db.Column(db.Integer, nullable=False) 
    title = db.Column(db.String(60), nullable=False) 
    streak = db.Column(db.Integer, nullable=False)
    gems = db.Column(db.Integer, nullable=False)
    lives = db.Column(db.Integer, nullable=False)
    last_update = db.Column(db.Date, nullable=False)
    def __init__(self, level=1, title="", streak=0, gems=0, lives=5):
        self.level = level
        self.title = title
        self.streak = streak
        self.gems = gems
        self.lives = lives
    def update_gems(self, gems, remove=False):
        if remove:
            self.gems -= gems
            return
        self.gems += gems

    def update_streak(self, reset=False):
        if reset:
            self.streak = 0
            return
        self.streak += 1

    def update_lives(self, lives, remove=False):
        if remove:
            self.lives -= lives
            return
        self.lives += lives

    def update_title(self):
        entry = Titles.query.filter(level_required <= self.level).order_by(level_required.desc()).first()
        self.title = entry.title if entry else ""

    def add_xp(self, xp):
        self.xp += xp
        return self.update_level()

    def update_level(self):
        entry = Levels.query.filter(xp_required <= self.xp).order_by(xp_required.desc()).first()
        self.level = entry.level if entry else 1
        return [self.level, self.update_title()]

class Levels(db.Model):
    _level_id = db.Column(db.Integer, nullable=False, primary_key=True)
    level = db.Column(db.Integer, nullable=False)
    xp_required = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(30), nullable=False)
    def __init__(self, level, xp_required, color):
        self.level = level
        self.xp_required = xp_required
        self.color = color