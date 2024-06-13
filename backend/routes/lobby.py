from fastapi import APIRouter
from typing import List, Dict
from ..logics.card_game import Game
from ..logics.lobby import Lobby

router = APIRouter()



@router.post("/join_lobby")
def join_lobby2(key_passed: str = Security(get_api_key)):
    LOBBY2.append(USERS[key_passed])
    player_added_event.set()
    
    return {}


@app.get("/players")
async def players(key_passed: str = Security(get_api_key)):
    player_added_event.clear()
    await player_added_event.wait()
    LOG(player_added_event.is_set())
    LOG("done waiting\n")
    return {"players": LOBBY2}
