from fastapi import APIRouter, Depends
from fastapi.params import Path
from pydantic import BaseModel
from typing import List, Dict


class Lobby(BaseModel):
    pass
    def __init__(self):
        self.usernames = List[str]
        
    def add(self, user: str):
        self.usernames.append(user)
        
    def get_players(self):
        return self.usernames

LOBBIES: Dict[str, Lobby] = {}

def get_lobby(lobby_key: str = Path()):
    return LOBBIES[lobby_key]


def set_lobby(key, lobby):
    LOBBIES[key] = lobby
