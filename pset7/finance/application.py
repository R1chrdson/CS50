import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    # Get data from user
    cash = db.execute(
        "SELECT cash FROM users WHERE id = :id", id=session["user_id"])[0]["cash"]
    stocks = db.execute(
        "SELECT symbol, SUM(quantity) AS quantity FROM stock WHERE user_id = :user_id GROUP BY symbol HAVING SUM(quantity) > 0", user_id=session["user_id"])
    total = cash
    for i in range(len(stocks)):
        currency = lookup(stocks[i]["symbol"])
        stocks[i].update({"name": currency["name"], "price": currency["price"]})
        stocks[i].update({"total": stocks[i]["quantity"]*stocks[i]["price"]})
        total += stocks[i]["total"]
        stocks[i].update({"price": usd(stocks[i]["price"]), "total": usd(stocks[i]["total"])})
    return render_template("index.html", Total=usd(total), Cash=usd(cash), cList=stocks)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""

    if request.method == "POST":
        # Get data from user
        symbol = request.form.get("symbol")
        try:
            shares = int(request.form.get("shares"))
        except ValueError:
            return apology("Incorrect shares", 400)
        if shares < 0:
            return apology("Incorrect shares", 400)

        cash = db.execute("SELECT cash FROM users WHERE id = :id", id=session["user_id"])[0]["cash"]

        # Get info from API
        currency = lookup(symbol)

        # Check on valid
        if currency == None:
            return apology("Invalid symbol")
        cash -= shares * currency["price"]
        if cash < 0:
            return apology("Can't afford", 403)

        # Insert stock to database
        db.execute("INSERT INTO stock (user_id, symbol, price, quantity) VALUES (:user_id, :symbol, :price, :quantity)",
                   user_id=session["user_id"], symbol=currency["symbol"], price=currency["price"], quantity=shares)
        db.execute("UPDATE users SET cash = :cash WHERE id = :id", cash=cash, id=session["user_id"])
        return redirect("/")
    else:
        return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    stocks = db.execute("SELECT symbol, quantity, price, time FROM stock WHERE user_id = :user_id", user_id=session["user_id"])
    return render_template("history.html", cList=stocks)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""

    if request.method == "POST":
        # Lookup indexes
        symbol = request.form.get("symbol")
        quote = lookup(symbol)

        # Is valid?
        if not symbol:
            return apology("Missing symbol", 400)
        if quote == None:
            return apology("Invalid symbol", 400)

        # Show it to user
        return render_template("quoted.html", Name=quote["name"], Symbol=quote["symbol"], Price=usd(quote["price"]))
    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        # Get name && password of user
        username = request.form.get("username")
        if not username:
            return apology("Missing username!", 400)
        password = request.form.get("password")
        confirm = request.form.get("confirmation")
        if not password:
            return apology("Missign password!", 400)
        if len(password) < 8:
            return apology("Your password must consist of 8 characters", 400)
        if not [s for s in password if s in '0123456789']:
            return apology("Your password must contain the numbers", 400)
        if not [s for s in password if s in '!@#$%^&*?/']:
            return apology("Your password must contain the special characters", 400)
        if not password == confirm:
            return apology("Your password confirmation is incorrect", 400)
        # Encrypt the password
        password = generate_password_hash(password)

        # Insert values into db
        result = db.execute("INSERT INTO users (username, hash) VALUES (:username, :hash)", username=username, hash=password)
        if not result:
            return apology("DataBase failture", 400)

        # Login
        session["user_id"] = result

        # Redirect user to home page
        return redirect("/")
    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    if request.method == "POST":
        cash = db.execute("SELECT cash FROM users WHERE id = :id", id=session["user_id"])[0]["cash"]
        symbol = request.form.get("symbol")

        # Check on valid symbol
        if symbol == None:
            return apology("Choose the symbol", 403)
        currency = lookup(symbol)["price"]

        # Check on valid quantity
        try:
            quantity = int(request.form.get("shares"))
        except ValueError:
            return apology("Incorrect shares", 400)

        # Check on user data
        data = db.execute(
            "SELECT symbol, SUM(quantity) AS quantity FROM stock WHERE user_id = :user_id GROUP BY symbol", user_id=session["user_id"])
        for i in range(len(data)):
            if data[i]["symbol"] == symbol and quantity > data[i]["quantity"]:
                return apology("Can't affort it", 400)
        # Add to the history
        db.execute("INSERT INTO stock (user_id, symbol, price, quantity) VALUES (:user_id, :symbol, :price, :quantity)",
                   user_id=session["user_id"], symbol=symbol, price=currency, quantity=quantity*-1)

        # Update the cash
        cash += currency*quantity
        db.execute("UPDATE users SET cash = :cash WHERE id = :id", cash=cash, id=session["user_id"])

        return redirect("/")
    else:
        stocks = db.execute(
            "SELECT symbol FROM stock WHERE user_id = :user_id GROUP BY symbol HAVING SUM(quantity) > 0", user_id=session["user_id"])
        return render_template("sell.html", symbol=stocks)


def errorhandler(e):
    """Handle error"""
    return apology(e.name, e.code)


# listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)