import os
basedir = os.path.abspath(os.path.dirname(__file__))

#SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'Database.db')
#SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
#SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "THISISMYHEROKUAPPBEWARE"