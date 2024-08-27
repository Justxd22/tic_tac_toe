from .routes.auth_routes import auth_bp

def init_api(auth):
    from .routes.auth_routes import init_auth_routes
    init_auth_routes(auth)
