from __future__ import annotations
from typing import Dict, List, Union
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import (
    HTTPException,
    status,
    Security,
    FastAPI,
    Request,
    Cookie,
    Response,
    Form,
)
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.exceptions import HTTPException
import random
import math
import string
import card_game
from user import User
import my_log
from my_log import LOG

API_KEYS = []
KEYS_TO_COINS = {}
USERNAME_TO_PASSWORD = {}
USERS : Dict[str:User] = {'3' : User("lidor" ,"1234")} # api_key |-> User
LOBBY1 : List[User] = []
USERNAME_TO_USER: Dict[str:User] = {}


app = FastAPI()        
        
        
#####################
### KEYS AND AUTH ###    
#####################
        
def api_key_query(api_key: Union[str, None] = Cookie(None)):
    # LOG("this is the api key: " + api_key)
    return api_key
    

def key_gen():
    result_str = "".join(
        random.choice(string.ascii_letters + string.digits) for i in range(20)
    )
    return result_str


def unauthorized_handler(a, b):
    return RedirectResponse(status_code=302, url="/")

def get_api_key(
    api_key: str = Security(api_key_query),
) -> str:
    # print("those are the keys: ", list(USERS.keys()))
    if api_key in USERS.keys():
        return api_key
    raise HTTPException(status_code=401, detail="no valid token")


######################
### GAMES AND MENU ###    
######################

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return FileResponse("HTML_files/root_page.html")


@app.get("/games/", response_class=HTMLResponse)
async def read_games(key_passed: bool = Security(get_api_key)):
    return FileResponse("HTML_files/games.html")


@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_item(key_passed: bool = Security(get_api_key)):
    # register_demo()  # DELETE
    return FileResponse("HTML_files/wheel_of_fortune.html")


@app.get("/games/wheel_of_fortune/spin_wheel/{bet_percentage}")
def generate_random_prize(bet_percentage):
    api_key = "3"
    bet_percentage = int(bet_percentage)
    if bet_percentage < 0 or bet_percentage > 100:
        return {"prize": 0, "coins": USERS[api_key].coins, "bet_money": 0}
    possible_prizes_list = [0.1, 1.9, 0.3, 1.7, 0.5, 0, 1.5, 0.7, 1.3, 0.9, 1.1]
    # make it less uniform and more close to a normal distribution, maybe using sum of bernulli random variables

    current_money = USERS[api_key].coins
    bet_money = (bet_percentage * current_money) // 100
    prize = math.floor(bet_money * random.choice(possible_prizes_list))
    USERS[api_key].coins += prize - bet_money
    return {"prize": prize, "coins": USERS[api_key].coins, "bet_money": bet_money}


@app.get("/games/black_jack/", response_class=HTMLResponse)
def read_black_jack(key_passed: str = Security(get_api_key)):
    api_key = "3" # TODO
    # register_demo()
    
    LOBBY1.append(api_key)
    
    return FileResponse('HTML_files/black_jack_lobby.html')


##################
### BLACK JACK ###
##################

def BJ_end_game(bj):
    LOG("BJ game ended!")
    bj.end_game()
    # TODO give money
    
def is_enough_money(players:List[str], cost):
    for api_key in players:
        if USERS[api_key].coins < cost:
            return False
        
    return True

asdf = []
@app.get("/games/black_jack/start_game_lobby1/{fee}")
def BJ_start_game_lobby(fee: int): # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
    LOG("BJ lobby 1!" + str(fee))
    
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
    
    LOG("started game")
    
    return {"hello": "world"}
    
    # return FileResponse('HTML_files/black_jack.html')
    # return FileResponse('HTML_files/lol.html')
    
@app.get("/games/black_jack/game", response_class=HTMLResponse)
def get_game():
    return FileResponse('HTML_files/black_jack.html')
    


@app.get("/games/black_jack/first_turn")
def BJ_play(): # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
    LOG("Let's play BJ!")
    
    api_key = "3" # TODO
    
    LOG(USERS)
    LOG(USERS[api_key])
    LOG(USERS[api_key].black_jack)
    LOG(asdf)

    
    bj = USERS[api_key].black_jack
    
    if bj.is_overdraft(api_key):
        pass
    if bj.is_game_over():
        LOG("called endgame")
        BJ_end_game(bj)
    return bj.get_player_json(api_key)

@app.get("/games/black_jack/draw")
def BJ_draw():
    LOG("draw")
    api_key = "3" # TODO
    bj = USERS[api_key].black_jack
    
    LOG(bj.status)
    
    if card_game.GameStatus.NO_GAME == bj.status:
        return bj.get_player_json(api_key)
    
    bj.draw(api_key)
    if bj.is_overdraft(api_key):
        pass
    if bj.is_game_over():
        BJ_end_game(bj)
        LOG("called endgame")

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
def register_demo():
    USERS["3"] = User("Lidor")
    return {"hello": "world"}


def register_demo():
    USERS["3"] = User("Lidor", "1234")
    return {"hello": "world"}

@app.get("/get_coin_amount/")
async def get_coin_amount(api_key: str = Security(get_api_key)):
    return str(USERS[api_key].coins)


@app.get("/create_guest_acount/")
async def create_guest_acount(response: Response):
    new_user: User = User("guest", "")
    my_api_key = key_gen()
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status": "ok"}


@app.post("/create_acount/")
async def create_acount(
    response: Response, username: str = Form(), password: str = Form
):
    new_user: User = User(username, password)
    USERNAME_TO_USER[username] = new_user
    my_api_key = key_gen()
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status": "ok"}


@app.post("/login/")
async def login(response: Response, username: str = Form(), password: str = Form):
    if username not in USERNAME_TO_USER.keys():
        return {"status": "not ok"}

    if USERNAME_TO_USER[username].password != password:
        return {"status": "not ok"}

    my_api_key = key_gen()
    USERS[my_api_key] = USERNAME_TO_USER[username]

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status": "ok"}


@app.get("/logout/")
async def logout(response: Response, api_key: str = Security(get_api_key)):

    USERS.pop(api_key)

    response.delete_cookie(key="api_key")
    return {"status": "ok"}


app.add_exception_handler(401, unauthorized_handler)
