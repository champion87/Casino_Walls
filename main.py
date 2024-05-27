from __future__ import annotations
from typing import Dict, List
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import HTTPException, status, Security, FastAPI, Request, Cookie, Response, Form
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.exceptions import HTTPException
import random
import string
import card_game
from user import User
import my_log
from my_log import LOG

API_KEYS = []
KEYS_TO_COINS = {}
USERNAME_TO_PASSWORD = {}
USERS : Dict[str:User] = {} # api_key |-> User
LOBBY1 : List[User] = []

app = FastAPI()        
        
        
#####################
### KEYS AND AUTH ###    
#####################
        
def api_key_query(api_key=Cookie()):
    return api_key

def key_gen():
    result_str = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(20))
    return result_str

def un_unauthorized_handler(a, b):
    return RedirectResponse(status_code=302, url='/')

def get_api_key(
    api_key: str = Security(api_key_query),
) -> str:
    if api_key in API_KEYS:
        return api_key
    raise HTTPException(status_code=401, detail="no valid token")


######################
### GAMES AND MENU ###    
######################

@app.get("/", response_class=HTMLResponse)
async def read_root():
    LOG("Let's get it started in here!")
    return FileResponse('HTML_files/root_page.html')

@app.get("/games/", response_class=HTMLResponse)
async def read_games(key_passed: str = Security(get_api_key)):
    return FileResponse('HTML_files/games.html')

@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_wheel_of_fortune(key_passed: str = Security(get_api_key)):
    return FileResponse('HTML_files/wheel_of_fortune.html')

@app.get("/games/black_jack/", response_class=HTMLResponse)
def read_black_jack(key_passed: str = Security(get_api_key)):
    api_key = "3" # TODO
    
    LOBBY1.append(api_key)
    
    return FileResponse('HTML_files/black_jack_lobby.html')


##################
### BLACK JACK ###
##################

def BJ_end_game(bj):
    LOG("BJ game ended!")
    bj.status = card_game.GameStatus.NO_GAME
    # TODO take money
    
def is_enough_money(players:List[str], cost):
    for api_key in players:
        if USERS[api_key].coins < cost:
            return False
        
    return True

asdf = []
@app.get("/games/black_jack/start_game_lobby1/{fee}", response_class=HTMLResponse)
def BJ_start_game_lobby(fee: int): # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
    LOG("BJ lobby 1!" + str(fee))
    
    register_demo()
    api_key = "3" # TODO
        
    bj = card_game.BlackJack(LOBBY1, fee)
    
    for key in LOBBY1:
        USERS[key].black_jack = bj
        asdf.append(bj)
        
    LOG("LOOK HERE!")    
    LOG(USERS[api_key].black_jack)
    LOG(asdf)
        
    bj.start_game()
    # LOG(bj.player_keys)
    # LOG(bj.hands)
    # LOG(bj)
    
    return FileResponse('HTML_files/black_jack.html')
    # return FileResponse('HTML_files/lol.html')
    


@app.get("/games/black_jack/first_turn")
def BJ_play(): # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
    LOG("Let's play BJ!")
    
    register_demo()
    api_key = "3" # TODO
    
    LOG(USERS)
    LOG(USERS[api_key])
    LOG(USERS[api_key].black_jack)
    LOG(asdf)

    
    bj = USERS[api_key].black_jack
    
    if bj.is_overdraft(api_key):
        pass
    if bj.is_game_over():
        BJ_end_game(bj)
    return bj.get_player_json(api_key)

@app.get("/games/black_jack/draw")
def BJ_draw():
    LOG("draw")
    api_key = "3" # TODO
    bj = USERS[api_key].black_jack
    
    if card_game.GameStatus.NO_GAME == bj.status:
        return bj.get_player_json(api_key)
    
    bj.draw(api_key)
    if bj.is_overdraft(api_key):
        pass
    if bj.is_game_over():
        BJ_end_game(bj)
    return bj.get_player_json(api_key)

@app.get("/games/black_jack/fold")
def BJ_fold():
    LOG("fold")
    api_key = "3" # TODO
    bj = USERS[api_key].black_jack
    
    if card_game.GameStatus.NO_GAME == bj.status:
        return bj.get_player_json(api_key)
    
    BJ_end_game(bj)

    return bj.get_player_json(api_key)


########################
### USER AND ACCOUNT ###
########################

@app.get("/register_user_3")
def register_user_3():
    USERS["3"] = User("Lidor", "1234")
    return {"hello" : "world"}

def register_demo():
    USERS["3"] = User("Lidor", "1234")
    return {"hello" : "world"}

@app.get("/get_coin_amount/")
async def get_coin_amount(api_key: string = Security(get_api_key)):
    return str(USERS[api_key].coins)

@app.get("/create_guest_acount/")
async def create_guest_acount(response : Response):
    new_user : User = User("guest", "")
    my_api_key = key_gen()
    API_KEYS.append(my_api_key)
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status" : "ok"}

@app.post("/create_acount/")
async def create_acount(response : Response, username : str = Form(), password : str = Form()):
    new_user : User = User(username, password)
    USERNAME_TO_PASSWORD[username] = password
    my_api_key = key_gen()
    API_KEYS.append(my_api_key)
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status" : "ok"}




app.add_exception_handler(401, un_unauthorized_handler)
