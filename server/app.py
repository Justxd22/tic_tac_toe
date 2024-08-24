# #!/usr/bin/python3

from flask import Flask, g
from flask_cors import CORS
# from middleware import LoggingMiddleware

# Import your modules
from multiplayer_socketIO import socketio
from models.auth import Auth

def create_app():
    # Import your modules
    from api import auth_bp
    from errors import error
    from database import init_db
    from config import get_config
    # from web_dynamic import web_bp

    app = Flask(__name__)
    app.config.from_object(get_config())
    # CORS(app, cors_allowed_origins="*")
    CORS(
        app,
        origins=app.config['CORS_CONFIG']['CORS_ORIGINS'],
        methods=app.config['CORS_CONFIG']['CORS_METHODS']
        )


    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(error)
    # app.register_blueprint(web_bp)

    # Initialize the database
    db = init_db(app)
    # The above line import the following from the db file:
        # database_url = os.getenv('DATABASE_URL', 'mongodb://localhost:27017/')
        # client = MongoClient(database_url)
        # db = client['tic_tac_toe']

    # Make db available to the app
    app.db = db

    # Initialize SocketIO
    # socketio.init_app(app, cors_allowed_origins="*")
    socketio.init_app(app, cors_allowed_origins=app.config['CORS_CONFIG']['CORS_ORIGINS'])

    # Apply middleware
    # app.wsgi_app = LoggingMiddleware(app.wsgi_app)

    return app

app = create_app()
g.AUTH = Auth(app.db)

if __name__ == '__main__':
    # app.run(host="127.0.0.1", port="3000", debug=True)
    socketio.run(
        app,
        host=app.config['HOST_NAME'],
        port=app.config['APP_PORT'],
        debug=app.config['DEBUG']
        )
