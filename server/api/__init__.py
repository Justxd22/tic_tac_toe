from .routes.auth_routes import auth_bp
from .routes.user_routes import user_bp

def init_api(auth, user):
    from .routes.auth_routes import init_auth_routes
    from .routes.user_routes import init_user_routes

    init_auth_routes(auth)
    init_user_routes(user)
