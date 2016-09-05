from App import db
from App.views import Response


db.create_all()
users = Response.query.all()
for user in users:
    db.session.delete(user)
    db.session.commit()
