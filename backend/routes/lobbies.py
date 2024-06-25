from typing import List, Dict
from fastapi.params import Path, Query
import asyncio
from logics.game import Game
# from logics.games import get_game
from logics.lobby import Lobby
# from logics.game_lobby import Lobby, get_lobby
from routes.auth import get_user_name, key_gen
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from utils.my_log import LOG


player_added_event = asyncio.Event()

router = APIRouter()
create_lobby_router = APIRouter()
specific_lobby_router = APIRouter()

    
############
### DATA ###
############

# USERNAME_TO_LOBBY = { "Lidor" : Lobby() }
LOBBIES: Dict[str, Lobby] = { "example-key" : Lobby("example game", 999, "example-key", 1337)}
SESSIONS : Dict[str , Game] = {"id" : Game()}

LOBBY_TO_SESSION : Dict[str, str] = {}
USERNAME_TO_LOBBY_KEY : Dict[str, str] = {}

# def get_session(game_key: str = Path()):
#     LOG(f"got {game_key = }")
#     return SESSIONS.get(game_key, None)

###########################
### Dependency Handlers ###
###########################

def get_session(game_key: str = Path(..., description="game key ahhhh")):
    # LOG(f"got {game_key = }")
    # # LOG("HEYYYY")
    # LOG(SESSIONS)
    return SESSIONS[game_key]
    # return game_key

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

@router.get("/")
def get_lobbies():
    LOG({'lobbies' : [lobby.export() for lobby in LOBBIES.values()]})
    return {'lobbies' : [lobby.export() for lobby in LOBBIES.values()]}

@specific_lobby_router.get("/player_count")
def get_player_count(lobby: Lobby = Depends(get_lobby)):
    return {'count' : len(lobby.get_players())}



# For example
# http://127.0.0.1:8000/api/2/lobbies/join_lobby
@specific_lobby_router.post("/join_lobby")
def join_lobby(lobby: Lobby = Depends(get_lobby), username = Depends(get_user_name)):
    if lobby == None:
        raise HTTPException(status_code=422, detail="no such lobby")
    if username in lobby.get_players(): #player is already in
        return {}
    if username in USERNAME_TO_LOBBY_KEY:
        LOBBIES[USERNAME_TO_LOBBY_KEY[username]].pop_user(username)
        
    lobby.add(username)
    USERNAME_TO_LOBBY_KEY[username] = lobby.key
    
    # player_added_event.set()
    LOG(LOBBIES)
    # return {}


# For example
# http://127.0.0.1:8000/api/2/lobbies/create_lobby/? ...

# TODO maybe later save the creator of the lobby
def create_lobby(game_name:str, prize:int, max_players:int = 9999):
    key = get_unused_id(LOBBIES)
    lobby = Lobby(game_name, max_players, key, prize)
    
    
    LOBBIES[key] = lobby
    # LOBBIES[lobby_key] = Lobby()
    
    
    return lobby, key




# /blackjack/?prize=100&max_players=4
from logics.card_game import BlackJack
@create_lobby_router.post("/blackjack")
def blackjack(prize: int , max_players: int):#, username = Depends(get_user_name)):
    lobby, lobby_key = create_lobby("BlackJack", prize, max_players)
    
    bj = BlackJack(lobby, prize, max_players)
    
    session_key = get_unused_id(SESSIONS)
    SESSIONS[session_key] = bj
    LOBBY_TO_SESSION[lobby_key] = session_key
    
    # LOG(LOBBIES)
    # LOG(SESSIONS)
    
    return {
        'lobby_key' : lobby_key,
        'session_key' : session_key
    }
    
@specific_lobby_router.post("/start_game")
def start_game(lobby_key:str = Path()):
    # raise Exception("started game")
    SESSIONS[LOBBY_TO_SESSION[lobby_key]].start_game()
    
    
    
    
# http://127.0.0.1:8000/api/2/lobbies/current_players
@specific_lobby_router.get("/current_players")
def players(lobby: Lobby = Depends(get_lobby)):
    LOG(lobby.get_players())
    return {"players": lobby.get_players()}

@specific_lobby_router.get("/wait_for_players")
async def wait_for_players(lobby: Lobby = Depends(get_lobby)):
    player_added_event.clear()
    await player_added_event.wait()
    return {"players": lobby.get_players()}

# # For example
# # http://127.0.0.1:8000/api/2/lobbies/start_game/
# @specific_lobby_router.post("/start_game") 
# async def start_game(lobby: Lobby = Depends(get_lobby)):
#     if game != None:
#         id = get_unused_id(SESSIONS)
#         SESSIONS[id] = game(lobby, prize)
#         return {}
    
    
# @router.get("/start_game") 
# async def start_game(lobby: Lobby = Depends(get_lobby), game: type = Depends(get_game), prize: int | None = None):
#     LOG(kwargs)
        
    



router.include_router(create_lobby_router, prefix='/create_lobby')
router.include_router(specific_lobby_router, prefix='/{lobby_key}')