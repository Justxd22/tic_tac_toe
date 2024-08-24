from .default import BaseConfig
import os

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "tic_tac_toe-dev")
    CORS_CONFIG = {
        'CORS_ORIGINS' : ['*'],
        'CORS_METHODS': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'TRACE']
    }
