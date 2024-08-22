"""Auth here."""
import bcrypt
from flask import Blueprint, jsonify
from uuid import uuid4
import time

auth = Blueprint('api', __name__, url_prefix="/api/auth")

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
                'password': 'admin123',
                'wins': '100',
                'losses': '10',
                'draws': '1',
                'game_played': '111',
                'score': '1000',
                'created_at': 'some_time_stamp',
                'avatar': 'nopic'
                })
        if not 'sessions' in db.list_collection_names():
            c = db['sessions']
            c.insert_one({
                '1234uuid4': {
                'mail': 'admin@com',
                'time': 'time'}
                })
        self.users = self.db['users']


    def register_user(self, email: str, username: str, password: str):
        u = self.users.find_one({ 'email': email })
        if u:
            raise ValueError(f"User {email} already exists")
        else:
            data = {
                'username': username,
                'email': email,
                'password': _hash_password(password),
                'wins': '0',
                'losses': '0',
                'draws': '0',
                'game_played': '0',
                'score': '0',
                'created_at': time.time(),
                'avatar': 'nopic'
            }
            user = self.users.insert_one(data)
            return user


    def valid_login(self, email: str, password: str) -> bool:
        """Is valid."""
        u = self.users.find_one({ 'email': email })
        if not u:
            return False
        if not bcrypt.checkpw(password.encode('utf-8'), u.get('password')):
            return False
        return True

    def create_session(self, email: str) -> str:
        """Create session."""
        u = self.users.find_one({ 'email': email })
        if not u:
            return None
        session_id = str(uuid4())
        self.db['sessions'].insert_one({
            'session_id': session_id,
            'email': email,
            'created_at': time.time()
        })
        return session_id

    def get_user_from_session_id(self, session_id: str):
        """Get user based on their session id."""
        if not session_id:
            return None
        u = self.db['sessions'].find_one({ 'session_id': session_id })
        if not u:
            return None
        u = self.users.find_one({ 'email': u.get('email') })
        return u
    
    def get_email_from_session_id(self, session_id: str):
        """Get user email based on their session id."""
        if not session_id:
            return None
        u = self.db['sessions'].find_one({ 'session_id': session_id })
        if not u:
            return None
        return u.get('email')

    def destroy_session(self, session_id: int):
        """Del user session."""
        self.db['sessions'].delete_one({ 'session_id': session_id })


    def update_password(self, session_id, password: str):
        """New password."""
        email = self.get_email_from_session_id(session_id=session_id)
        if not email:
            return 404
        res = self.db['sessions'].update_one( { 'email': email }, { '$set': { 'password': _hash_password(password) } })
        if res > 0:
            return True
        return False


def _hash_password(password: str):
    """Hash given pass."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

