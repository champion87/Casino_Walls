from pydantic import BaseModel, Field
from typing import List

class Lobby(BaseModel):
    usernames: List[str] = Field(default_factory=list)

    def add(self, user: str):
        self.usernames.append(user)
        
    def get_players(self):
        return self.usernames