from .default import BaseConfig
import os

class ProductionConfig(BaseConfig):
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "tic_tac_toe")
    CORS_CONFIG = {
        'CORS_ORIGINS' : [os.getenv("CORS_ORIGINS", '').split(',')],
        'CORS_METHODS': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
