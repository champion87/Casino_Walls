from pydantic import BaseModel, Field
from typing import List

class Lobby:#(BaseModel):
    # TODO 'creator' field
    # usernames: List[str] = Field(default_factory=list)

    def __init__(self):
        self.usernames = []
        self.is_locked = False

    def add(self, user: str):
        '''Return True if the lobby is locked.'''
        if self.is_locked:
            return True
        self.usernames.append(user)
    
    def lock(self):
        self.is_locked = True
        
    def get_players(self):
        return self.usernames