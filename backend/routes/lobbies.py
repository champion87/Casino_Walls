from typing import List, Dict
from fastapi.params import Path, Query
import asyncio
from logics.game import Game
from logics.games import get_game
from logics.lobby import Lobby
# from logics.game_lobby import Lobby, get_lobby
from routes.auth import get_user_name, key_gen
from fastapi import APIRouter, Depends
from utils.my_log import LOG

router = APIRouter()
player_added_event = asyncio.Event()



    
    
    
############
### DATA ###
############

# USERNAME_TO_LOBBY = { "Lidor" : Lobby() }
LOBBIES: Dict[str, Lobby] = { "1" : Lobby()}
SESSIONS : Dict[str , Game] = {"id" : Game()}


###########################
### Dependency Handlers ###
###########################

def get_session(session_key: str = Path()):
    LOG(f"got {session_key = }")
    return SESSIONS[session_key]

def set_session(key, game):
    SESSIONS[key] = game

# TODO current default behavior is create new Lobby if not found
def get_lobby(lobby_key: str = Path()):
    if lobby_key not in LOBBIES.keys():
        LOBBIES[lobby_key] = Lobby()
    return LOBBIES[lobby_key]

def set_lobby(key, lobby):
    LOBBIES[key] = lobby

########################
### Helper Functions ###
########################

def get_unused_id(data):
    return key_gen() # TODO validate that the key is unique

######################
### Lobby Handlers ###
######################

# TODO delete empty lobbies
# TODO don't allow user to be in many lobbies

# For example
# http://127.0.0.1:8000/api/2/lobbies/idan/join_lobby
@router.post("/{username}/join_lobby")
def join_lobby(lobby: Lobby = Depends(get_lobby), username = Path()): #  = Depends(get_user_name)
    
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

# For example
# http://127.0.0.1:8000/api/2/lobbies/start_game/?game_name=blackjack&prize=100
@router.post("/start_game") 
async def start_game(lobby: Lobby = Depends(get_lobby), game: type = Depends(get_game), prize: int | None = None):
    if game != None:
        id = get_unused_id(SESSIONS)
        SESSIONS[id] = game(lobby, prize)
        return {}
    
        
    
    


