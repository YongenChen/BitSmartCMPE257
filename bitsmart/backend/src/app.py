from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from sys import stderr

from config import (
    PORT,
    CLIENT_DOMAIN,
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": CLIENT_DOMAIN}})


# Handle price prediction
@app.route("/api/predict", methods=["GET"])
def predict_price():
    try:
        date = request.args.get("date")
        if not date:
            raise Exception("InvalidParamError", 400, "date is required")
        date = datetime.strptime(date, "%Y-%m-%d")
        print(f"Date: {date}", file=stderr)
        return {"message": "WIP"}, 200
    except Exception as e:
        return handle_error(e)


def handle_error(error):
    try:
        print(f"Error: {error}", file=stderr)
        name, status_code, message = error.args
        return {"name": name, "message": message}, status_code
    except Exception as e:
        print(f"Error: {e}", file=stderr)
        return (
            {
                "name": "ServerError",
                "message": "An unknown error occurred",
            },
            500,
        )


# Handle path not found
@app.errorhandler(404)
def path_not_found(_):
    message = f"The requested path {request.path} was not found on server."
    return {"message": message}, 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
