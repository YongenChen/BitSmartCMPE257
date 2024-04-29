import os
import dotenv

# Load environment variables
dotenv.load_dotenv(dotenv_path=".env")
PORT = os.getenv("PORT") if os.getenv("PORT") else 8000
CLIENT_DOMAIN = os.getenv("CLIENT_DOMAIN")
