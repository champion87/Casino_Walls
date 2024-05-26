from __future__ import annotations

from typing import Dict, Union


from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import HTTPException, status, Security, FastAPI, Request, Cookie, Response, Form
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.exceptions import HTTPException
import random
import string
import card_game
import logging
import uvicorn
from user import User


logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

def LOG(msg):
    logger.debug(msg)

# class card_t:
#     symbol 

app = FastAPI()

# Username |-> User
USERNAME_TO_USER : Dict[str:User]= {}

# api_key |-> User
USERS : Dict[str:User] = {}
        

def api_key_query(api_key : Union[str, None] = Cookie(None)):
    #LOG("this is the api key: " + api_key)
    return api_key

def key_gen():
    result_str = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(20))
    return result_str

def unauthorized_handler(a, b):
    return RedirectResponse(status_code=302, url='/')

def get_api_key(
    api_key: str = Security(api_key_query),
) -> str:
    #print("those are the keys: ", list(USERS.keys()))
    if api_key in USERS.keys():
        return api_key
    raise HTTPException(status_code=401, detail="no valid token")
    

@app.get("/", response_class=HTMLResponse)
async def read_root():
    LOG("Let's get it started in here!")
    return FileResponse('HTML_files/root_page.html')

@app.get("/games/", response_class=HTMLResponse)
async def read_games(response: Response, api_key: str = Security(get_api_key)):
    return FileResponse('HTML_files/games.html')

@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_wheel_of_fortune(api_key: str = Security(get_api_key)):
    return FileResponse('HTML_files/wheel_of_fortune.html')

@app.get("/games/black_jack/", response_class=HTMLResponse)
def read_black_jack(api_key: str = Security(get_api_key)):
    return FileResponse('HTML_files/black_jack.html')


@app.get("/register_user_3")
def register_user_3():
    USERS["3"] = User("Lidor", "1234")
    return {"hello" : "world"}

def register_demo():
    USERS["3"] = User("Lidor", "1234")
    return {"hello" : "world"}


def BJ_end_game(bj):
    LOG("BJ game ended!")
    bj.status = card_game.GameStatus.NO_GAME
    # TODO take money

@app.get("/games/black_jack/start_game")
def BJ_play(): # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
    # ANSWER for Lidor: that function means that unloged users cant access the page.
    # the return value of the function is the api key of the user that accessed that page
    # if you write: BJ_play(api_key: str = Security(get_api_key)). api_key is the users api key
    LOG("Let's play BJ!")
    
    register_demo()
    api_key = "3" # TODO
    
    USERS[api_key].black_jack = card_game.BlackJack()
    bj = USERS[api_key].black_jack
    
    bj.start_game([api_key])
    
    if bj.is_overdraft():
        BJ_end_game(bj)
    return bj.to_json()

@app.get("/games/black_jack/draw")
def BJ_draw():
    LOG("draw")
    api_key = "3" # TODO
    bj = USERS[api_key].black_jack
    
    if card_game.GameStatus.NO_GAME == bj.status:
        return bj.to_json()
    
    bj.draw()
    if bj.is_overdraft():
        BJ_end_game(bj)
    return bj.to_json()

@app.get("/games/black_jack/fold")
def BJ_fold():
    LOG("fold")
    api_key = "3" # TODO
    bj = USERS[api_key].black_jack
    
    if card_game.GameStatus.NO_GAME == bj.status:
        return bj.to_json()
    
    BJ_end_game(bj)

    return bj.to_json()

@app.get("/get_coin_amount/")
async def get_coin_amount(api_key: str = Security(get_api_key)):
    return str(USERS[api_key].coins)

@app.get("/create_guest_acount/")
async def create_guest_acount(response : Response):
    new_user : User = User("guest", "")
    my_api_key = key_gen()
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status" : "ok"}

@app.post("/create_acount/")
async def create_acount(response : Response, username : str = Form(), password : str = Form):
    new_user : User = User(username, password)
    USERNAME_TO_USER[username] = new_user
    my_api_key = key_gen()
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status" : "ok"}

@app.post("/login/")
async def login(response : Response, username : str = Form(), password : str = Form):
    if (username not in USERNAME_TO_USER.keys()):
        return {"status" : "not ok"}
    
    if (USERNAME_TO_USER[username].password != password):
        return {"status" : "not ok"}
        
    my_api_key = key_gen()
    USERS[my_api_key] = USERNAME_TO_USER[username]

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status" : "ok"}

@app.get("/logout/")
async def logout(response : Response, api_key: str = Security(get_api_key)):
    
    USERS.pop(api_key)

    response.delete_cookie(key="api_key")
    return {"status" : "ok"}

app.add_exception_handler(401, unauthorized_handler)
