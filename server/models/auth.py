"""Auth here."""
import bcrypt
from datetime import datetime
import regex as re

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

        # Precompile regex patterns using the regex library
        self.email_regex = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        self.username_regex = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")


    def register_user(self, email: str, username: str, password: str):
        '''Registers a user'''
        # Check if email and username are valid
        if not self.email_regex.match(email):
            raise ValueError("Invalid email address.")
        if not self.username_regex.match(username):
            raise ValueError("Invalid username.")

        # Check if email and username already exist
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


    def deregister_user(self, username: str):
        '''De-registers a the user with the given username'''
        result = self.users.delete_one({'username': username})
        if result.deleted_count == 1:
            return f"User {username} has been deregistered successfully."
        else:
            raise ValueError(f"Failed to deregister user {username}.")


    def valid_login(self, username: str, password: str) -> bool:
        """Is valid."""
        u = self.users.find_one({ 'username': username })
        if not u:
            return (False, 0)
        try:
            if not bcrypt.checkpw(password.encode('utf-8'), u.get('password').encode('utf-8')):
                return (False, 1)
        except Exception:
            return (False, 1)
        return (True, 0)

    @staticmethod
    def hash_password(password: str):
        """Hash given pass."""
        return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
