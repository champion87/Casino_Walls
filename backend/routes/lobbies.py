from typing import List, Dict
import asyncio
from logics.game import Game
from logics.games import get_game
from logics.game_lobby import Lobby, get_lobby
from auth import get_user_name
from fastapi import APIRouter, Depends

router = APIRouter()
player_added_event = asyncio.Event()

# @router.get()


@router.post("/join_lobby")
def join_lobby2(lobby: Lobby = Depends(get_lobby), username: str = Depends(get_user_name)):
    lobby.add(username)
    player_added_event.set()
    
    return {}


@router.get("/current_players")
def players(lobby: Lobby = Depends(get_lobby)):
    return {"players": lobby.get_players()}

@router.get("/wait_for_players")
async def wait_for_players(lobby: Lobby = Depends(get_lobby)):
    player_added_event.clear()
    await player_added_event.wait()
    return {"players": lobby.get_players()}

@router.post("/start_game")
async def start_game(lobby: Lobby = Depends(get_lobby), game: Game = Depends(get_game)):
    if game != None:
        game()
        return {}
    
        
    
    


