from flask import Flask
from flask_heroku import Heroku
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
heroku = Heroku(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
db = SQLAlchemy(app)

from App import views

