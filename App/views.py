from App import app, db
from flask import request, redirect, url_for, render_template, send_file
from flask_login import login_user, login_required, current_user
from .models import Response, create_dataset

@app.route('/', methods=["GET"])
def home():
    if current_user.is_authenticated:
        pass

    turkid = request.args.get("turkid")
    if turkid is None:
        return redirect(url_for('gamestart'))

    user = Response.query.filter_by(turkid=turkid).first()

    if user:
        login_user(user, remember=True)

    else:
        fundtype = "food" if request.args.get("condid") == 0 else "special"
        user = Response(turkid, fundtype)
        login_user(user, remember=True)
        db.session.add(user)
        db.session.commit()
    return redirect(url_for('gamestart'))


@app.route('/gamestart', methods=["GET", "POST"])
@login_required
def gamestart():
    user = current_user
    if request.method == "POST":
        post_args = {key: value for key, value in request.form.items()}
        user.info = post_args


    template_args = user.info.copy()
    template_args["redirpath"] = url_for('gamestart')
    db.session.commit()
    if user.weeknumber == 0:
        return render_template('Budgeter.html', **template_args)
    elif user.weeknumber < 4:
        return render_template('Budgeter2.html', **template_args)
    else:
        return "The game is over. Your validation code for the MechanicalTurk HIT is: \nCFDM0087Q\n\nYour bonus will be sent to you soon."

@app.route("/login")
def login():
    return render_template("login.html")



@app.route('/getGameData')
def plot_csv():
    create_dataset()
    return send_file('outputs/GameData.csv',
                     mimetype='text/csv',
                     attachment_filename='Adjacency.csv',
                     as_attachment=True)