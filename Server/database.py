from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date

db = SQLAlchemy()

class Levels(db.Model):
    _level_id = db.Column(db.Integer, nullable=False, primary_key=True)
    level = db.Column(db.Integer, nullable=False)
    xp_required = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(30), nullable=False)
    def __init__(self, level, xp_required, color):
        self.level = level
        self.xp_required = xp_required
        self.color = color

        db.session.add(self)
        db.session.commit()

    def propreties(self):
        return {
            "level_propreties": {
            "level": self.level,
            "xp_required": self.xp_required,
            "color": self.color
            }
        }
    
class DailyQuests(db.Model):
    _dailyquest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    difficulty = db.Column(db.String(30), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today())
    reward = db.Column(db.Integer, nullable=False)
    def __init__(self, difficulty, date, reward):
        self.difficulty = difficulty
        self.date = date
        self.reward = reward


        db.session.add(self)
        db.session.flush()

        self.quest_id = self._dailyquest_id
        
        db.session.commit()
    
    def get_id(self):
        return self.id
    
    def propreties(self):
        return {
            "quest_difficulty": self.difficulty,
            "quest_date": self.date,
            "quest_reward": self.reward
        }
    
class Titles(db.Model):
    _title_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(60), nullable=False)
    level_required = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(60), nullable=False)
    def __init__(self, title, level_required, color):
        self.title = title
        self.level_required = level_required
        self.color = color
        
        db.session.add(self)
        db.session.commit()
    
    def propreties(self):
        return {
            "title": self.title,
            "level_required": self.level_required,
            "color": self.color
        }

class Users(db.Model):
    _user_id = db.Column(db.Integer, unique=True, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.initialized = "HI"
        self.email = email
        self.password = generate_password_hash(password)

        db.session.add(self)
        db.session.flush()

        self.daily_quests = []
        daily_quests = DailyQuests.query.filter_by(date=date.today())
        for quest in daily_quests:
            quest_id = quest._dailyquest_id
            self.daily_quests.append(UserDailyQuests(self._user_id, quest_id, False, None))
        self.stats = Stats(user_id=self._user_id, xp=0, level=1, title="", streak=0, gems=0, lives=5, last_update=date.today())

        db.session.commit()
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def check_all_quests(self):
        if self.finished_all_daily_quests():
            self.stats.update_streak()

    def finished_all_daily_quests(self):
        for quest in self.daily_quests:
            if quest.isComplete:
                continue
            return False
        return True
    
    def return_self(self):
        return self
    
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
    def __init__(self, user_id, xp, level, title, streak, gems, lives, last_update):
        self._user_id = user_id
        self.xp = xp
        self.level = level
        self.title = title
        self.streak = streak
        self.gems = gems
        self.lives = lives
        self.last_update = last_update

        db.session.add(self)
        db.session.commit()

    def update_gems(self, gems, remove=False):
        if remove:
            self.gems -= gems
            db.session.commit()
            return
        self.gems += gems
        db.session.commit()

    def update_streak(self, reset=False):
        if reset:
            self.streak = 0
            db.session.commit()
            return
        self.streak += 1
        db.session.commit()

    def update_lives(self, lives, remove=False):
        if remove:
            self.lives -= lives
            db.session.commit()
            return
        self.lives += lives
        db.session.commit()

    def update_title(self):
        entry = Titles.query.filter(level_required <= self.level).order_by(level_required.desc()).first()
        self.title = entry.title if entry else ""
        db.session.commit()

    def add_xp(self, xp):
        self.xp += xp
        db.session.commit()
        return self.update_level()

    def update_level(self):
        entry = Levels.query.filter(xp_required <= self.xp).order_by(xp_required.desc()).first()
        self.level = entry.level if entry else 1
        db.session.commit()

        return [self.level, self.update_title()]
    
    def get_stats(self):
        return {
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
    isComplete = db.Column(db.Boolean, nullable=False)
    achieved_on = db.Column(db.Date)
    def __init__(self, user_id, quest_id, isComplete, achieved_on):
        self.user_id = user_id
        self.quest_id = quest_id
        self.isComplete = isComplete
        self.achieved_on = achieved_on

    def set_as_complete(self):
        if not self.isComplete:
            self.isComplete = True
            self.award()

    def award(self):
            quest = DailyQuests.query.filter_by(_dailyquest_id=self.quest_id).first()
            reward = quest.reward

            user = Users.query.filter_by(_user_id=self.user_id)
            user.stats.update_gems(reward)
        