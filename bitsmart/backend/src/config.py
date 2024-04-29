import os
import dotenv

# Load environment variables
dotenv.load_dotenv(dotenv_path=".env")
PORT = os.environ["PORT"]
CLIENT_DOMAIN = os.environ["CLIENT_DOMAIN"]
