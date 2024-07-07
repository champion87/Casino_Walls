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
from db import COINS, LOBBIES, LOBBY_TO_SESSION,  SESSIONS, USERNAME_TO_LOBBY_KEY


player_added_event = asyncio.Event()

router = APIRouter()
create_lobby_router = APIRouter()
specific_lobby_router = APIRouter()

    

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
    return {'lobbies' : [lobby.export() for lobby in LOBBIES.values() if lobby.is_available()]}

@router.get("/my_lobby")
def get_my_lobby(username = Depends(get_user_name)):
    LOG({'lobbies' : [lobby.export() for lobby in LOBBIES.values()]})
    LOG(USERNAME_TO_LOBBY_KEY)
    return { "lobby_key" : USERNAME_TO_LOBBY_KEY[username] }

@specific_lobby_router.get("/player_count")
def get_player_count(lobby: Lobby = Depends(get_lobby)):
    return {'count' : len(lobby.get_players())}

@specific_lobby_router.post("/leave_lobby")
def leave_lobby(lobby: Lobby = Depends(get_lobby), username = Depends(get_user_name)):
    lobby.pop_user(username)


# For example
# http://127.0.0.1:8000/api/2/lobbies/join_lobby
@specific_lobby_router.post("/join_lobby")
def join_lobby(lobby: Lobby = Depends(get_lobby), username = Depends(get_user_name)):
    
        

    if lobby == None:
        raise HTTPException(status_code=422, detail="no such lobby")
    if username in lobby.get_players(): #player is already in
        raise HTTPException(status_code=422, detail="FUCKKKK")
        # LOG("ALREADY IN")
        
        return {}
        
    # LOG("GOOOOOOOOOOOOOOOOOOO")
    try:
        lobby.add(username)
    except:
        raise HTTPException(status_code=422, detail="lobby is locked")
    
    if username in USERNAME_TO_LOBBY_KEY:
        USERNAME_TO_LOBBY_KEY.pop(username)
        
    USERNAME_TO_LOBBY_KEY[username] = lobby.key
    
    # player_added_event.set()
    # LOG(LOBBIES)
    # LOG(USERNAME_TO_LOBBY_KEY)
    
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
    try:
        SESSIONS[LOBBY_TO_SESSION[lobby_key]].start_game()
    except:
        return {}
    
@specific_lobby_router.post("/set_ready_for_start_game")
def set_ready(lobby_key:str = Path(), lobby: Lobby = Depends(get_lobby), username = Depends(get_user_name)):
    if COINS[username] <= lobby.prize:
        return {"result" : f"Not enough money! Need {lobby.prize} coins..."}
    else:
        lobby.set_ready(username)
        if lobby.is_ready():
            try:
                SESSIONS[LOBBY_TO_SESSION[lobby_key]].start_game()
                return {"result" : "Ready!"}
                
            except:
                LOG("ERROR IN SET READY: NO SESSION FOUND")
                return {}
                    

    
    
@specific_lobby_router.get("/is_game_started")
def is_started(lobby_key:str = Path()):
    # raise Exception("started game")
    return {
        "is_started" : SESSIONS[LOBBY_TO_SESSION[lobby_key]].is_started(),
        "session_key" : LOBBY_TO_SESSION[lobby_key]
    }
    
    
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