from App import db, login_manager
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY

class Response(db.Model):
    __tablename__ = "responses"
    turkid = db.Column('turkid', db.String(20), unique=True, index=True, primary_key=True)
    fundtype = db.Column('fundtype', db.String(20))
    startdate = db.Column('startdate', db.DateTime)
    enddate = db.Column('enddate', db.DateTime)
    weeknumber = db.Column('weeknumber', db.Integer())
    fundpastbalance = db.Column('fundpastbalance', db.Float())
    salarypastbalance = db.Column('salarypastbalance', db.Float())
    fundhistory = db.Column('fundhistory', ARRAY(db.Float()))
    salaryhistory = db.Column('salaryhistory', ARRAY(db.Float()))
    foodhistorysalary = db.Column('foodhistorysalary', ARRAY(db.Float()))
    foodhistoryfund = db.Column('foodhistoryfund', ARRAY(db.Float()))
    miscchoices = db.Column('miscchoices', ARRAY(db.Float()))
    timespenthistory = db.Column('timespenthistory', ARRAY(db.Float()))

    def __init__(self, turkid, fundtype):
        self.turkid = turkid
        self.fundtype = fundtype
        self.startdate = datetime.utcnow()
        self.enddate = datetime.utcnow()
        self.weeknumber = 0
        self.fundpastbalance = 100
        self.salarypastbalance = 0
        self.fundhistory = []
        self.salaryhistory = []
        self.foodhistoryfund = []
        self.foodhistorysalary = []
        self.miscchoices = []
        self.timespenthistory = []

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    @property
    def info(self):
        info = {}
        for key in ["fundtype", "weeknumber", "fundpastbalance", "salarypastbalance", "fundhistory",
                    "salaryhistory", "foodhistoryfund", "foodhistorysalary", "timespenthistory", "miscchoices"]:
            info[key] = self.__dict__.get(key)
        return info

    @info.setter
    def info(self, dict):
        for key in ["weeknumber", "fundpastbalance", "salarypastbalance", "fundhistory", "salaryhistory",
                    "foodhistoryfund", "foodhistorysalary", "timespenthistory", "miscchoices"]:
            if key in ["fundpastbalance", "salarypastbalance"]:
                setattr(self, key, float(dict[key]))
            elif key == "weeknumber":
                setattr(self, key, int(dict[key]))
            else:
                setattr(self, key, dict[key])

    def get_id(self):
        return self.turkid

    def __repr__(self):
        base = "MTurk ID = {}\n".format(self.turkid)
        for key, value in self.info.items():
            base += "{} = {}\n".format(key, value)
        return base


@login_manager.user_loader
def load_user(user_id):
    return Response.query.get(user_id)
