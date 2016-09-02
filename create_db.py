from App import db
from App.views import Response
from config import SQLALCHEMY_DATABASE_URI
from config import SQLALCHEMY_MIGRATE_REPO

users = Response.query.all()
for user in users:
    db.session.delete(user)
    db.session.commit()
db.create_all()
