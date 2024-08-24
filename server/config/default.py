import os
class BaseConfig:
    DEBUG = False
    HOST_NAME = os.getenv("HOST_NAME", 'localhost')
    APP_PORT = os.getenv("APP_PORT", '3000')
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    CORS_CONFIG = {
        'CORS_ORIGINS' : ['*'],
        'CORS_METHODS': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'TRACE']
    }
