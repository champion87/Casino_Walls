from typing import List, Dict
from ..logics.card_game import Game
from ..logics.game_lobby import Lobby, get_lobby
from .auth import get_user_name
from fastapi import APIRouter, Depends
router = APIRouter()

@router.get()

@router.post("/join_lobby")
def join_lobby2(lobby: Lobby = Depends(get_lobby), username: str = Depends(get_user_name)):
    lobby.add(username)
    player_added_event.set()
    
    return {}


@app.get("/players")
async def players(key_passed: str = Security(get_api_key)):
    player_added_event.clear()
    await player_added_event.wait()
    LOG(player_added_event.is_set())
    LOG("done waiting\n")
    return {"players": LOBBY2}
