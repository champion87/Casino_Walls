from pydantic import BaseModel, Field
from typing import List
from utils.my_log import LOG

class Lobby:#(BaseModel):
    # TODO 'creator' field
    # usernames: List[str] = Field(default_factory=list)

    # TODO edge cases: max players is negative or zero
    def __init__(self, game_name:str, max_players:int, key:str, prize:int):
        self.usernames = []
        self.is_locked = False
        self.is_full = False
        self.max_players = max_players
        self.game_name = game_name
        self.key = key
        self.prize = prize

    def add(self, user: str):
        if len(self.usernames) >= self.max_players:
            raise Exception(f"Lobby <{self.key}> is full!")
        if self.is_locked:
            raise Exception(f"Lobby <{self.key}> is locked!")
        else:
            self.usernames.append(user)
            
    
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
    
    def pop_user(self, username):
        if username in self.usernames:
            self.usernames.remove(username)
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