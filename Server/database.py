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
    rewards = db.column_property(db.Column(db.JSON))
    def __init__(self, title, description, difficulty, rewards):
        self.title = title
        self.description = description
        self.difficulty = difficulty
        self.rewards = rewards

        db.session.add(self)
        db.session.commit()

class StoryQuests(db.Model):
    _story_quest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    requirements = db.column_property(db.Column(db.JSON))
    paras = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(32), nullable=False)
    rewards = db.column_property(db.Column(db.JSON))
    def __init__(self, title, requirements, paras, difficulty, rewards):
        self.title = title
        self.requirements = requirements
        self.paras = paras
        self.difficulty = difficulty
        self.rewards = rewards

        db.session.add(self)
        db.session.commit()

class DailyQuests(db.Model):
    _daily_quest_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    requirements = db.column_property(db.Column(db.JSON))
    paras = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(32), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today())
    rewards = db.column_property(db.Column(db.JSON))
    def __init__(self, title, requirements, paras, difficulty, date, rewards):
        self.title = title
        self.requirements = requirements
        self.paras = paras
        self.difficulty = difficulty
        self.date = date
        self.rewards = rewards

        db.session.add(self)
        db.session.commit()

class Boosters(db.Model):
    _booster_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(32), nullable=False)
    description = db.Column(db.String(64), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(64), nullable=False)
    multiplier = db.Column(db.Integer, nullable=False)
    def __init__(self, title, description, price, category, multiplier):
        self.title = title
        self.description = description
        self.price = price
        self.category = category
        self.multiplier = multiplier
        
        db.session.add(self)
        db.session.commit()
        
class Items(db.Model):
    _item_id = db.Column(db.Integer, nullable=False, primary_key=True)
    title = db.Column(db.String(32), nullable=False)
    description = db.Column(db.String(64), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    def __init__(self):
    
        db.session.add(self)
        db.session.commit()

#----------------------------------------------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------------#

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
    level = db.column_property(db.Column(db.JSON))
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

class UserTitles(db.Model):
    _user_titles_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _title_id = db.Column(db.Integer, db.ForeignKey(Titles._title_id), nullable=False)
    def __init__(self, user_id, title_id):
        self._user_id = user_id
        self._title_id = title_id

        db.session.add(self)
        db.session.commit()

class UserDailyQuests(db.Model):
    _user_daily_quests_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _daily_quest_id = db.Column(db.Integer, db.ForeignKey(DailyQuests._daily_quest_id), nullable=False)
    isComplete = db.Column(db.Boolean, nullable=False)
    def __init__(self, user_id, quest_id, isComplete):
        self._user_id = user_id
        self._daily_quest_id = quest_id
        self.isComplete = isComplete

        db.session.add(self)
        db.session.commit()

class UserStoryQuests(db.Model):
    _user_story_quests_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _story_quest_id = db.Column(db.Integer, db.ForeignKey(StoryQuests._story_quest_id), nullable=False)
    isComplete = db.Column(db.Boolean, nullable=False)
    completion_date =  db.Column(db.Date)
    def __init__(self, user_id, quest_id, isComplete, completion_date):
        self._story_quest_id = quest_id
        self._user_id = user_id
        self.isComplete = isComplete
        self.completion_date = completion_date

        db.session.add(self)
        db.session.commit()
        
class UserAchievements(db.Model):
    _user_achievements_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _achievement_id = db.Column(db.Integer, db.ForeignKey(Achievements._achievement_id), nullable=False)
    isComplete = db.Column(db.Boolean, nullable=False)
    completion_date =  db.Column(db.Date)
    def __init__(self, user_id, achievement_id, isComplete, completion_date):
        self._user_id = user_id
        self._achievement_id = achievement_id
        self.isComplete = isComplete
        self.completion_date = completion_date

        db.session.add(self)
        db.session.commit()

class UserBoosters(db.Model):
    _user_boosters_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _booster_id = db.Column(db.Integer, db.ForeignKey(Boosters._booster_id), nullable=False)
    category = db.Column(db.String(64), db.ForeignKey(Boosters.category), nullable=False)
    multiplier = db.Column(db.Float, db.ForeignKey(Boosters.multiplier), nullable=False)
    isActive = db.Column(db.Boolean, nullable=False)
    expiration_date = db.Column(db.Date)
    def __init__(self, user_id, booster_id, category, multiplier, isActive, expiration_date):
        self._user_id = user_id
        self._booster_id = booster_id
        self.category = category        
        self.multiplier = multiplier
        self.isActive = isActive
        self.expiration_date = expiration_date

        db.session.add(self)
        db.session.commit()
        
class UserItems(db.Model):
    _user_items_id = db.Column(db.Integer, nullable=False, primary_key=True)
    _user_id = db.Column(db.Integer, db.ForeignKey(Users._user_id), nullable=False)
    _item_id = db.Column(db.Integer, db.ForeignKey(Items._item_id), nullable=False)
    def __init__(self, user_id, item_id):
        self._user_id = user_id
        self._item_id = item_id

        db.session.add(self)
        db.session.commit()