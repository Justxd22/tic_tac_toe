# #!/usr/bin/python3

from flask import Flask
from flask_cors import CORS
# from middleware import LoggingMiddleware

# Import your modules
from multiplayer_socketIO import socketio
from models.auth import Auth

def create_app():
    # Import your modules
    from api import auth_bp, init_api
    from errors import error
    from database import init_db
    from config import get_config
    # from web_dynamic import web_bp

    app = Flask(__name__)
    app.config.from_object(get_config())
    app.secret_key = app.config['SECRET_KEY']

    # CORS(app, cors_allowed_origins="*")
    CORS(
        app,
        origins=app.config['CORS_CONFIG']['CORS_ORIGINS'],
        methods=app.config['CORS_CONFIG']['CORS_METHODS'],
        supports_credentials=True, # Required for cookies, in cross-origin requests
        )


    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(error)
    # app.register_blueprint(web_bp)


    # Initialize the database
    db = init_db(app)

    # Make db available to the app
    app.db = db

    # Initialize API
    auth = Auth(app.db)
    init_api(auth)

    # Initialize SocketIO
    # socketio.init_app(app, cors_allowed_origins="*")
    socketio.init_app(app, cors_allowed_origins=app.config['CORS_CONFIG']['CORS_ORIGINS'])
    # socketio.init_app(app, cors_allowed_origins="http://localhost:5173")

    # Apply middleware
    # app.wsgi_app = LoggingMiddleware(app.wsgi_app)

    return app

app = create_app()

@app.route('/')
def main_route():
    return "hello friend!"

if __name__ == '__main__':
    # app.run(host="127.0.0.1", port="3000", debug=True)
    socketio.run(
        app,
        host=app.config['HOST_NAME'],
        port=app.config['APP_PORT'],
        debug=app.config['DEBUG'].lower() == 'true',
        )
