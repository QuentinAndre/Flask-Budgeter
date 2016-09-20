from App import app, db
from flask import request, redirect, url_for, render_template
from flask_login import login_user, login_required, current_user, logout_user
from .models import Response
from datetime import datetime
import sys
import json

@app.route('/start', methods=["GET"])
@app.route('/', methods=["GET"])
def home():
    if current_user.is_authenticated:
        pass

    turkid = request.args.get("turkid")
    if turkid is None:
        return redirect(url_for('game'))

    user = Response.query.filter_by(turkid=turkid).first()

    if user:
        login_user(user, remember=True)

    else:
        fundtype = "food" if request.args.get("condid") == "0" else "special"
        user = Response(turkid, fundtype)
        login_user(user, remember=True)
        db.session.add(user)
        db.session.commit()
    return redirect(url_for('game'))


@app.route('/game', methods=["GET", "POST"])
@login_required
def game():
    user = current_user
    if request.method == "POST":
        data = json.loads(request.form['jsondata'])
        user.info = {key: value for key, value in data.items()}

    print(user, file=sys.stderr)
    template_args = user.info.copy()
    template_args["redirpath"] = url_for('game')
    if user.weeknumber == 0:
        db.session.commit()
        return render_template('Budgeter.html', **template_args)
    elif user.weeknumber < 4:
        db.session.commit()
        return render_template('Budgeter2.html', **template_args)
    else:
        user.enddate = datetime.utcnow()
        db.session.commit()
        return render_template('EndGame.html')

@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/logout")
def logout():
    logout_user()
    return render_template("login.html")