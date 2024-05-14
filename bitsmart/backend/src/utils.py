from datetime import datetime
from yahoofinancials import YahooFinancials


def validate_date(date):
    if not date:
        message = "Parameter 'date' is required"
        raise Exception("InvalidParamError", 400, message)
    try:
        date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        message = f"Incorrect date format: {date}"
        raise Exception("InvalidParamError", 400, message)
    if date.date() > datetime.today().date():
        message = f"Price data is not available on selected date"
        raise Exception("ResourceNotFoundError", 400, message)


def validate_initial_investment(value):
    if not value:
        message = "Parameter 'initial_investment' is required"
        raise Exception("InvalidParamError", 400, message)
    try:
        float(value)
    except Exception:
        message = f"Incorrect initial investment value format: {value}"
        raise Exception("InvalidParamError", 400, message)


def get_price_data(start_date, end_date):
    yahoo_financials = YahooFinancials("BTC-USD")
    data = yahoo_financials.get_historical_price_data(start_date, end_date, "daily")
    if "prices" not in data["BTC-USD"]:
        message = f"Price data is not available on selected date"
        raise Exception("ResourceNotFoundError", 400, message)
    return data["BTC-USD"]["prices"]
