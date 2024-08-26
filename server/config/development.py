from .default import BaseConfig
import os

class DevelopmentConfig(BaseConfig):
    DEBUG = os.getenv("DEBUG", True)
    SECRET_KEY = os.getenv("SECRET_KEY", "Flask-tic_tac_toe")
    CORS_CONFIG = {
        'CORS_ORIGINS' : os.getenv("CORS_ORIGINS", '*').split(','),
        'CORS_METHODS': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'TRACE']
    }

    MONGO_URI = f"mongodb://{BaseConfig.MONGO_DB_USERNAME}:{BaseConfig.MONGO_DB_PASSWD}@localhost:27017/{BaseConfig.MONGO_DB_NAME}"
