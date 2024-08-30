import regex as re
import bcrypt
from models.auth import Auth

class User:
    def __init__(self, db):
        '''Initialize a User instance'''
        self.db = db
        self.users = self.db['users']

        # Precompile regex patterns using the regex library
        self.email_regex = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        self.username_regex = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")


    def _update_score(self, username, score):
        '''Updates the score of the given user.'''
        self.users.update_one({'username': username}, {'$inc': {'score': score}})

    def increment_wins(self, username):
        '''Increments the wins of the given username by one.'''
        self.users.update_one({'username': username}, {'$inc': {'wins': 1, 'game_played': 1}})
        self._update_score(username, 3)

    def increment_losses(self, username):
        '''Increments the loses of the given username by one.'''
        user = self.users.find_one({'username': username})
        if user['score'] >= 3:
            self._update_score(username, -3)
        else:
            self._update_score(username, -user['score'])
        self.users.update_one({'username': username}, {'$inc': {'losses': 1, 'game_played': 1}})

    def increment_draws(self, username):
        '''Increments the draws of the given username by one.'''
        self.users.update_one({'username': username}, {'$inc': {'draws': 1, 'game_played': 1}})
        self._update_score(username, 1)

    def update_username(self, username, new_username):
        '''Updates username to new_username.'''
        # Check if new_username is valid
        if not self.username_regex.match(new_username):
            raise ValueError("Invalid username.")

        # Check if new_username already exists
        if self.users.find_one({'username': new_username}):
            raise ValueError(f"User {username} already exists")

        # If new_username is valid and doesn't exist, proceed with the update
        self.users.update_one({'username': username}, {'$set': {'username': new_username}})

        # Return the new username and a boolean value indicating success to update the session state
        return new_username

    def update_email(self, username, new_email):
        '''Updates the email of the given user'''
        # Check if new_email is valid
        if not self.email_regex.match(new_email):
            raise ValueError("Invalid email address.")

        # Check if new_email already exists
        if self.users.find_one({'email': new_email}):
            raise ValueError(f"User {new_email} already exists")

        # If new_email is valid and doesn't exist, proceed with the update
        self.users.update_one({'username': username}, {'$set': {'email': new_email}})
        return new_email

    def update_avatar(self, username, new_avatar):
        '''Updates the avatar of the user with the given username'''
        self.users.update_one({'username': username}, {'$set': {'avatar': new_avatar}})

    def delete_avatar(self, username):
        '''Deletes the avatar of the user with the given username'''
        self.users.update_one({'username': username}, {'$unset': {'avatar': ""}})

    def get_info(self, username):
        user = self.users.find_one({'username': username})
        del user['_id']
        del user['password']
        user['created_at'] = user['created_at'].strftime("%Y-%m-%d %H:%M:%S")
        return user

    def update_password(self, username, old_password, new_password):
        user = self.users.find_one({'username': username})
        if bcrypt.checkpw(old_password.encode(), user['password'].encode()):
            self.users.update_one({'username': username}, {'$set': {'password': Auth.hash_password(new_password)}})
            return True
        else:
            raise ValueError("Old password does not match the current password")
