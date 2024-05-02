from flask import Flask, request
from flask_cors import CORS
from sys import stderr

from config import (
    PORT,
    CLIENT_DOMAIN,
)
import services

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": CLIENT_DOMAIN}})


# Handle price prediction
@app.route("/api/predict", methods=["GET"])
def predict_price():
    try:
        date = request.args.get("date")
        services.validate_date(date)

        initial_investment = request.args.get("initial_investment")
        services.validate_initial_investment(initial_investment)
        initial_investment = float(initial_investment)

        prices = services.get_price_data(date)
        return {
            "initial_investment": initial_investment,
            "prices": prices,
        }, 200
    except Exception as e:
        return handle_error(e)


def handle_error(error):
    try:
        print(f"Error: {error}", file=stderr)
        name, status_code, message = error.args
        return {"name": name, "message": message}, status_code
    except Exception as e:
        print(f"Error: {e}", file=stderr)
        name = "ServerError"
        message = "An unknown error occurred"
        return {"name": name, "message": message}, 500


# Handle path not found
@app.errorhandler(404)
def path_not_found(_):
    message = f"The requested path {request.path} was not found on server."
    return {"message": message}, 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
