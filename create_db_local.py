import os

os.environ["APP_SETTINGS"] = "config.DevelopmentConfig"
os.environ["DATABASE_URL"] = "postgresql+psycopg2://localhost/Flask-Budgeter"

from App import db
from App.views import Response

db.reflect()
db.drop_all()
db.create_all()

users = Response.query.all()
for user in users:
    db.session.delete(user)
    db.session.commit()
