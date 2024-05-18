# BitSmart

## About

BitSmart is an application that will predict the best buy and sell times for Bitcoin within 7 days of a selected date.

## Development

### Frontend

- Have [Node.js](https://nodejs.org/en/download) installed
- Directory: `cd bitsmart/frontend`
- Create .env file based on .env.example file
- Install deps (if needed): `npm install`
- Run: `npm start`

### Backend

- Have [Python3](https://www.python.org/downloads) installed
- Directory: `cd bitsmart/backend`
- Install deps (if needed): `pip3 install -r requirements.txt`
- Run: `python3 main.py`

### With Docker

- Have [Docker](https://docs.docker.com/desktop) installed
- Directory: `cd bitsmart`
- Create .env file based on .env.example file
- Run/build: `docker compose up [-d] [--build] [service-name]`
- Watch: `docker compose watch [--no-up] [service-name]`
- Clean up: `docker compose down [-v] [--rmi all] [service-name]`
