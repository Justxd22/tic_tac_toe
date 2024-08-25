"""Auth here."""
import bcrypt
from uuid import uuid4
from datetime import datetime

class Auth:
    """Auth class."""

    def __init__(self, db):
        """Iniit."""
        self.db = db
        if not 'users' in db.list_collection_names():
            c = db['users']
            c.insert_one({
                'username': 'admin',
                'email': 'admin@com',
                'password': self.hash_password('admin123'),
                'wins': 100,
                'losses': 10,
                'draws': 1,
                'game_played': 111,
                'score': 1000,
                'created_at': datetime.utcnow(),
                'avatar': 'nopic'
                })
        self.users = self.db['users']


    def register_user(self, email: str, username: str, password: str):
        e = self.users.find_one({ 'email': email })
        u = self.users.find_one({ 'username': username })
        if u:
            raise ValueError(f"User {username} already exists")
        if e:
            raise ValueError(f"User {email} already exists")
        data = {
            'username': username,
            'email': email,
            'password': self.hash_password(password),
            'wins': 0,
            'losses': 0,
            'draws': 0,
            'game_played': 0,
            'score': 0,
            'created_at': datetime.utcnow(),
            'avatar': 'nopic'
        }
        user = self.users.insert_one(data)
        return user


    def deregister_user(self, email: str):
        e = self.users.find_one({ 'email': email })
        if not e:
            raise ValueError(f"User {email} doesn't exist")

        result = self.users.delete_one({'email': email})
        if result.deleted_count == 1:
            return f"User {email} has been deregistered successfully."
        else:
            raise ValueError(f"Failed to deregister user {email}.")


    def valid_login(self, username: str, password: str) -> bool:
        """Is valid."""
        u = self.users.find_one({ 'username': username })
        if not u:
            print("fffff", username)
            return (False, 0)
        try:
            if not bcrypt.checkpw(password.encode('utf-8'), u.get('password').encode('utf-8')):
                return (False, 1)
        except Exception:
            return (False, 1)
        return (True, 0)

    def get_user_from_session_id(session, self):
        """Get user based on their session id."""
        username = session.get('username', None)
        if not username:
            return None
        u = self.users.find_one({ 'username': username })
        return u

    def update_password(self, session, password: str):
        """New password."""
        email = session.get('email', None)
        if not email:
            return 404
        res = self.users.update_one( { 'email': email }, { '$set': { 'password': self.hash_password(password) } })
        if res > 0:
            return True
        return False

    @staticmethod
    def hash_password(password: str):
        """Hash given pass."""
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
