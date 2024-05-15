from joblib import load
from sklearn import *
import pandas as pd

from src.config import MODEL_PATH
from src import utils


class PredictionModel:
    def __init__(self):
        try:
            models = load(MODEL_PATH)
            self.model_open = models["open"]
            self.model_high = models["high"]
            self.model_low = models["low"]
            self.model_close = models["close"]
            self.model_average = models["average"]
        except Exception as e:
            raise Exception("ServerError", 500, e)

    def predict(self, selected_date):
        # Obtain past 14 days pricing data from selected date
        selected_date = pd.to_datetime(selected_date)
        start_date = str((selected_date - pd.Timedelta(days=13)).date())
        end_date = str(selected_date.date())
        prices = utils.get_price_data(start_date, end_date)

        # Preprocess past pricing data for prediction
        past_data = pd.DataFrame(prices)
        past_data["date"] = pd.to_datetime(past_data["formatted_date"])
        past_data = past_data.sort_values(by="date")
        past_data.set_index("date", inplace=True)
        dates = pd.date_range(
            start=past_data.index.min(),
            end=past_data.index.max(),
            freq="D",
        )
        past_data.dropna(inplace=True)
        past_data = past_data.reindex(dates, method="ffill")
        past_data.reset_index(inplace=True)
        past_data.rename(columns={"index": "date"}, inplace=True)
        past_data.rename(columns={"volume": "Volume"}, inplace=True)
        for i in range(1, 8):
            past_data[f"lag_close_{i}"] = past_data["close"].shift(i)
        past_data.dropna(inplace=True)

        # Perform next 7 days prediction from selected date
        predicted_data = []
        for i in range(7):
            base_date = selected_date - pd.Timedelta(days=i)
            record = past_data[past_data["date"] == base_date]
            feature_names = [
                "lag_close_1",
                "lag_close_2",
                "lag_close_3",
                "lag_close_4",
                "lag_close_5",
                "lag_close_6",
                "lag_close_7",
                "Volume",
            ]
            feature_vector = record[feature_names].values.reshape(1, -1)
            feature_vector_df = pd.DataFrame(feature_vector, columns=feature_names)
            predicted_open = self.model_open.predict(feature_vector_df)[0]
            predicted_high = self.model_high.predict(feature_vector_df)[0]
            predicted_low = self.model_low.predict(feature_vector_df)[0]
            predicted_close = self.model_close.predict(feature_vector_df)[0]
            predicted_average = self.model_average.predict(feature_vector_df)[0]
            predicted_data.insert(
                0,
                {
                    "date": (base_date + pd.Timedelta(days=7)).strftime("%Y-%m-%d"),
                    "open": predicted_open,
                    "high": predicted_high,
                    "low": predicted_low,
                    "close": predicted_close,
                    "average": predicted_average,
                },
            )
        return predicted_data

    def swing_trading_strategy(self, data, investment_amount):
        # Preprocess past pricing data for swing strategy
        data = pd.DataFrame(data)
        data["date"] = pd.to_datetime(data["date"])
        data.dropna(inplace=True)
        data = data.sort_values(by="date")
        data.set_index("date", inplace=True)
        dates = pd.date_range(start=data.index.min(), end=data.index.max(), freq="D")
        data = data.reindex(dates, method="ffill")
        data.reset_index(inplace=True)
        data.rename(columns={"index": "date"}, inplace=True)
        if data.empty:
            raise ValueError("No data available")

        # Initialize trading state
        start_date = data["date"][0]
        initial_open_price = data["open"][0]
        investment_amount = float(investment_amount)
        bitcoins = investment_amount / initial_open_price
        cash = 0
        sell_executed = False
        load_executed = False
        sell_day = None
        load_day = None
        total_avg_closing_price = 0
        number_of_days = len(data.index)

        for i in range(number_of_days):
            base_date = start_date + pd.Timedelta(days=i)
            price = data[data["date"] == base_date]
            price_high = price["high"].values[0]
            price_low = price["low"].values[0]
            price_avg = price["average"].values[0]

            # Accumulate average closing prices
            total_avg_closing_price += price_avg

            # Decide when to sell: if predicted high price is 5% higher than the open price
            if not sell_executed and price_high > initial_open_price * 1.05:
                sell_executed = True
                sell_day = base_date
                cash = bitcoins * price_high
                bitcoins = 0

            # Decide when to load: after selling, if the predicted low price is 5% lower
            if sell_executed and not load_executed and price_low < price_high * 0.95:
                # Ensure not loading on the sell day
                if base_date != sell_day:
                    load_executed = True
                    load_day = base_date
                    bitcoins = cash / price_low
                    cash = 0

        # Calculate average closing price over the prediction period
        average_closing_price = total_avg_closing_price / number_of_days

        # Final valuation at the end of the prediction period or the last available day
        final_day = start_date + pd.Timedelta(days=number_of_days - 1)
        final_close_price = data.loc[data["date"] == final_day, "close"].values[0]
        final_cash = cash if cash > 0 else bitcoins * final_close_price

        # Calculate profit/loss
        profit_loss = final_cash - investment_amount

        return {
            "profit_loss": profit_loss,
            "total_investment_amount": investment_amount,
            "total_exit_amount": final_cash,
            "average_closing_price": average_closing_price,
            "sell_day": str(sell_day.date()) if sell_day else "NA",
            "load_day": str(load_day.date()) if load_day else "NA",
            "final_bitcoins": bitcoins if cash == 0 else 0,
        }
