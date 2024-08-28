import os
from .development import DevelopmentConfig

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_config():
    env = os.getenv('FLASK_ENV', 'development').lower()
    if env == 'production':
        from .production import ProductionConfig
        return ProductionConfig
    return DevelopmentConfig
