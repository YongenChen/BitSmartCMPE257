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
        number_of_days = len(data.index)
        initial_open_price = data["open"][0]
        investment_amount = float(investment_amount)
        initial_bitcoins = investment_amount / initial_open_price
        last_closing_amount = data["close"][number_of_days - 1]

        # Hold
        strategies = [
            {
                "bitcoin": initial_bitcoins,
                "cash": 0,
                "exit_amount": initial_bitcoins * last_closing_amount,
                "sell_day": "NA",
                "load_day": "NA",
            }
        ]

        # Only sell
        only_sell_index = 0
        for i in range(1, number_of_days):
            if data["open"][i] > data["open"][only_sell_index]:
                only_sell_index = i
        only_sell_entry = data.loc[only_sell_index]
        strategies.append(
            {
                "bitcoin": 0,
                "cash": initial_bitcoins * only_sell_entry["open"],
                "exit_amount": initial_bitcoins * only_sell_entry["open"],
                "sell_day": str(data["date"][only_sell_index].date()),
                "load_day": "NA",
            }
        )

        # Sell and load
        sell_index = 0
        load_index = 0
        max_index = 0
        max_bitcoins = initial_bitcoins
        for i in range(1, number_of_days):
            entry = data.loc[i]
            sell_cash = initial_bitcoins * data["open"][max_index]
            load_bitcoins = sell_cash / entry["open"]
            if load_bitcoins > max_bitcoins:
                max_bitcoins = load_bitcoins
                sell_index = max_index
                load_index = i
            if entry["open"] > data["open"][max_index]:
                max_index = i
        strategies.append(
            {
                "bitcoin": max_bitcoins,
                "cash": 0,
                "exit_amount": max_bitcoins * last_closing_amount,
                "sell_day": str(data["date"][sell_index].date()),
                "load_day": str(data["date"][load_index].date()),
            }
        )

        # Evaluate for best strategy
        best_strategy = strategies[0]
        for i in range(len(strategies)):
            if strategies[i]["exit_amount"] > best_strategy["exit_amount"]:
                best_strategy = strategies[i]

        # Calculate average closing price
        total_avg_closing_price = data["average"].sum()
        average_closing_price = total_avg_closing_price / number_of_days

        return {
            "profit_loss": best_strategy["exit_amount"] - investment_amount,
            "total_investment_amount": investment_amount,
            "total_exit_amount": best_strategy["exit_amount"],
            "average_closing_price": average_closing_price,
            "sell_day": best_strategy["sell_day"],
            "load_day": best_strategy["load_day"],
            "final_bitcoins": best_strategy["bitcoin"],
        }
