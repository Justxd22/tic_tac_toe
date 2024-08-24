import os
from .development import DevelopmentConfig
from .production import ProductionConfig

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path="../.env")

def get_config():
    env = os.getenv('FLASK_ENV', 'development').lower()
    if env == 'production':
        return ProductionConfig
    return DevelopmentConfig
