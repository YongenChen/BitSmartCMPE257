from flask import Flask, request
from flask_cors import CORS
from sys import stderr

from src.config import CLIENT_DOMAIN
from src.model import PredictionModel
from src import utils

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": CLIENT_DOMAIN}})


# Handle price prediction
@app.route("/api/predict", methods=["GET"])
def predict_price():
    try:
        # Read parameters
        date = request.args.get("date")
        initial_investment = request.args.get("initial_investment")

        # Validate parameters
        utils.validate_date(date)
        utils.validate_initial_investment(initial_investment)

        # Perform next 7 days prediction + swing strategy
        model = PredictionModel()
        predictions = model.predict(date)
        swing_result = model.swing_trading_strategy(predictions, initial_investment)

        return {
            "predictions": predictions,
            "swing": swing_result,
        }, 200
    except Exception as e:
        return handle_error(e)


def handle_error(error):
    try:
        if len(error.args) != 3:
            raise Exception(error)
        name, status_code, message = error.args
        if status_code >= 500:
            raise Exception(message)
        print(f"Error: {error}", file=stderr)
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
