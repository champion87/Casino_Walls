from typing import List, Dict
from fastapi.params import Path, Query
import asyncio
from logics.game import Game
from logics.games import get_game
from logics.lobby import Lobby
# from logics.game_lobby import Lobby, get_lobby
from routes.auth import get_user_name, key_gen
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from utils.my_log import LOG

router = APIRouter()

@router.get("/hey_yo")
def test():
    LOG(":WOW")


player_added_event = asyncio.Event()

create_lobby_router = APIRouter()

specific_lobby_router = APIRouter()
    
@create_lobby_router.get("/hey_yo")
def test():
    LOG("WOW")
    
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
        return None
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
# http://127.0.0.1:8000/api/2/lobbies/join_lobby
@specific_lobby_router.post("/join_lobby")
def join_lobby(lobby: Lobby = Depends(get_lobby), username = Depends(get_user_name)):
    if lobby == None:
        raise HTTPException(status_code=422, detail="no such lobby")
    lobby.add(username)
    player_added_event.set()
    
    return {}


# For example
# http://127.0.0.1:8000/api/2/lobbies/create_lobby/? ...

def create_lobby(username):
    lobby = Lobby()
    lobby.add(username)
    
    key = get_unused_id(LOBBIES)
    
    LOBBIES[key] = lobby
    # LOBBIES[lobby_key] = Lobby()
    
    
    return lobby, key

# /blackjack/?prize=100&max_players=4
from logics.card_game import BlackJack
@create_lobby_router.post("/blackjack")
def blackjack(prize: int , max_players: int, username = Depends(get_user_name)):
    lobby, key = create_lobby(username)
    
    bj = BlackJack(lobby, prize, max_players)
    LOG("created bj lobby wink wink!")
    
    # TODO return the key?
    
    
# http://127.0.0.1:8000/api/2/lobbies/current_players
@specific_lobby_router.get("/current_players")
def players(lobby: Lobby = Depends(get_lobby)):
    return {"players": lobby.get_players()}

@specific_lobby_router.get("/wait_for_players")
async def wait_for_players(lobby: Lobby = Depends(get_lobby)):
    player_added_event.clear()
    await player_added_event.wait()
    return {"players": lobby.get_players()}

# For example
# http://127.0.0.1:8000/api/2/lobbies/start_game/
@specific_lobby_router.post("/start_game") 
async def start_game(lobby: Lobby = Depends(get_lobby)):
    if game != None:
        id = get_unused_id(SESSIONS)
        SESSIONS[id] = game(lobby, prize)
        return {}
    
    
# @router.get("/start_game") 
# async def start_game(lobby: Lobby = Depends(get_lobby), game: type = Depends(get_game), prize: int | None = None):
#     LOG(kwargs)
        
    



router.include_router(create_lobby_router, prefix='/create_lobby')
router.include_router(specific_lobby_router, prefix='/{lobby_key}')