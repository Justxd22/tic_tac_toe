from .default import BaseConfig
import os

class ProductionConfig(BaseConfig):
    DEBUG = os.getenv("DEBUG", False)
    SECRET_KEY = os.getenv("SECRET_KEY", None)
    if SECRET_KEY is None:
        raise ValueError("No SECRET_KEY set for Flask application")

    if not os.getenv("CORS_ORIGINS", None):
        raise ValueError("No CORS_ORIGINS set for Flask application")

    CORS_CONFIG = {
        'CORS_ORIGINS' : os.getenv("CORS_ORIGINS", '').split(','),
        'CORS_METHODS': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }

    MONGO_URI = f"mongodb://{BaseConfig.MONGO_DB_USERNAME}:{BaseConfig.MONGO_DB_PASSWD}@mongo:27017/{BaseConfig.MONGO_DB_NAME}"
