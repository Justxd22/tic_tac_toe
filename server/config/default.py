import os
from dotenv import load_dotenv

load_dotenv()
class BaseConfig:
    HOST_NAME = os.getenv("HOST_NAME", None)
    APP_PORT = os.getenv("APP_PORT", None)

    MONGO_DB_NAME = os.getenv("MONGO_DATABASE", None)
    MONGO_DB_USERNAME = os.getenv("MONGO_NON_ROOT_USERNAME", None)
    MONGO_DB_PASSWD = os.getenv("MONGO_NON_ROOT_PASSWORD", None)

    CORS_SUPPORTS_CREDENTIALS = os.getenv("CORS_SUPPORTS_CREDENTIALS", 'false')
    SAMESITE_POLICY = os.getenv("SESSION_COOKIE_SAMESITE", 'Lax')

    if HOST_NAME is None:
        raise ValueError("No HOST_NAME set for Flask application")
    elif APP_PORT is None:
        raise ValueError("No APP_PORT set for Flask application")
    elif MONGO_DB_NAME is None:
        raise ValueError("No MONGO_APP_DB set for Flask application")
