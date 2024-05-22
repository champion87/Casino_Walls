from typing import Union
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import HTTPException, status, Security, FastAPI, Request, Cookie, Response
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.exceptions import HTTPException
import random
import string
import card_game


# class card_t:
#     symbol 

API_KEYS = []
KEYS_TO_COINS = {}
app = FastAPI()

# api_key |-> User
USERS = {}

NO_GAME = None

class User:
    def __init__(self, name):
        self.name = name
        self.coins = 100
        self.black_jack = NO_GAME
        self.wheel = NO_GAME

        

def api_key_query(api_key=Cookie()):
    return api_key

def key_gen():
    result_str = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(20))
    return result_str

def un_authrized_handler(a, b):
    return RedirectResponse(status_code=302, url='/')


def get_api_key(
    api_key_query: str = Security(api_key_query),
) -> bool:
    if api_key_query in API_KEYS:
        return api_key_query
    raise HTTPException(status_code=401, detail="no valid token")
    

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return FileResponse('HTML_files/root_page.html')

@app.get("/games/", response_class=HTMLResponse)
async def read_games(key_passed: bool = Security(get_api_key)):
    return FileResponse('HTML_files/games.html')

@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_item(key_passed: bool = Security(get_api_key)):
    return FileResponse('HTML_files/wheel_of_fortune.html')

@app.get("/games/black_jack/", response_class=HTMLResponse)
def read_item(key_passed: bool = Security(get_api_key)):
    return FileResponse('HTML_files/black_jack.html')

def read_item():
    return FileResponse('HTML_files/black_jack.html')

@app.get("/register_user_3")
def register_demo():
    USERS["3"] = User("Lidor")
    return {"hello" : "world"}

def end_game():
    print("BJ game ended!")
    # TODO take money

@app.get("/games/black_jack/start_game")
def play_BJ():
    api_key = "3" # TODO
    USERS[api_key].black_jack = card_game.BlackJack()
    if USERS[api_key].black_jack.is_overdraft():
        end_game()
    return USERS[api_key].black_jack.to_json()

@app.get("/games/black_jack/draw")
def BJ_draw(api_key):
    api_key = "3" # TODO
    USERS[api_key].black_jack.draw()
    if USERS[api_key].black_jack.is_overdraft():
        end_game()
    return USERS[api_key].black_jack.to_json()

@app.get("/games/black_jack/fold")
def read_item():
    pass

@app.get("/get_coin_amount/")
async def get_coin_amount(api_key: string = Security(get_api_key)):
    return str(KEYS_TO_COINS[api_key])

@app.get("/create_guest_acount/")
async def create_guest_acount(response : Response):
    my_api_key = key_gen()
    API_KEYS.append(my_api_key)
    KEYS_TO_COINS[my_api_key] = 100

    response.set_cookie(key="api_key", value=my_api_key)
    return {"status" : "ok"}

app.add_exception_handler(401, un_authrized_handler)
