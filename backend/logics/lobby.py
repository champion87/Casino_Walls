from pydantic import BaseModel, Field
from typing import List

class Lobby:#(BaseModel):
    # TODO 'creator' field
    # usernames: List[str] = Field(default_factory=list)

    def __init__(self):
        self.usernames = []

    def add(self, user: str):
        self.usernames.append(user)
        
    def get_players(self):
        return self.usernames