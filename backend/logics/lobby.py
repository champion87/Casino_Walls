from pydantic import BaseModel, Field
from typing import List
from utils.my_log import LOG

class Lobby:#(BaseModel):
    # TODO 'creator' field
    # usernames: List[str] = Field(default_factory=list)

    # TODO edge cases: max players is negative or zero
    def __init__(self, game_name:str, max_players:int, key:str, prize="default_prize_valueXXX"):
        self.usernames = []
        self.is_locked = False
        self.is_full = False
        self.max_players = max_players
        self.game_name = game_name
        self.key = key
        self.prize = prize
        self.ready = {}
        self.old_users = []
# # TODO validate that the returning player once was in the lobby
#     def re_enter(self, user: str):
#         if user not in self.usernames:
#             self.usernames.append(user)

    def kick_all_players(self):
        self.usernames = []

    def add(self, user: str):
        if len(self.usernames) >= self.max_players:
            raise Exception(f"Lobby <{self.key}> is full!")
        if user not in self.old_users and self.is_locked:
            raise Exception(f"Lobby <{self.key}> is locked!")
        else:
            if user not in self.usernames:
                self.usernames.append(user)
                self.old_users.append(user)
            LOG("HEYYYYYYYYYYYYY")
            LOG(self.usernames)
            
    def set_ready(self, username: str):
        self.ready[username] = True
    
    def is_ready(self):
        for user in self.usernames:
            if not self.ready.get(user, False):
                LOG(f"{user} is not ready")
                return False
            LOG(f"{user} is ready!")
        return True
    
    def lock(self):
        self.is_locked = True
        
    def is_available(self):
        if self.is_locked:
            return False
        if len(self.usernames) >= self.max_players:
            return False
        return True
        
    def get_players(self):
        return self.usernames
    
    def get_num_players(self):
        return len(self.usernames)
    
    def pop_user(self, username):
        if username in self.usernames:
            self.usernames.remove(username)
            self.old_users.remove(username)
        else:
            raise Exception(f"User <{username}> is not in Lobby <{self.key}>!")
    
    def export(self):
        res = {
            'key' : self.key,
            'max_players' : self.max_players,
            'game_name' : self.game_name,
            'is_locked' : self.is_locked,
            'prize' : self.prize
        }
        return res
    
    def __repr__(self):
        return str(self.export()) + str(self.usernames)