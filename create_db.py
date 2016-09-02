from App import db
from App.views import Response

users = Response.query.all()
for user in users:
    db.session.delete(user)
    db.session.commit()
db.create_all()
