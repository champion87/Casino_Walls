from typing import Union
from fastapi.responses import HTMLResponse
from fastapi import HTTPException, status, Security, FastAPI, Request
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
import random
import string
from card_game import *


# class card_t:
#     symbol 

API_KEYS = {}
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

        

api_key_query = APIKeyQuery(name="api-key", auto_error=False)
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)
 
def key_gen():
    result_str = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(20))
    return result_str


def get_page(page_address):
    if Security(get_api_key):
        return FileResponse(page_address)
    

def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
) -> str:
    print(api_key_query)

    if api_key_query in API_KEYS.values():
        return api_key_query
    if api_key_header in API_KEYS.values():
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )

@app.get("/", response_class=HTMLResponse)
async def read_root(request : Request):
    return FileResponse('HTML_files/root_page.html')


@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_item():
    return FileResponse('HTML_files/wheel_of_fortune.html')

@app.get("/games/black_jack/", response_class=HTMLResponse)
def read_item():
    return FileResponse('HTML_files/black_jack.html')

@app.get("/register_user_3")
def register_demo():
    USERS["3"] = User("Lidor")

@app.get("/games/black_jack/start_game")
def play_BJ():
    api_key = "3" # TODO
    USERS[api_key].black_jack = BlackJack()
    return USERS[api_key].black_jack.
    # TODO take money
    

@app.get("/games/black_jack/draw")
def BJ_draw(api_key):
    api_key = "3" # TODO
    USERS[api_key].black_jack = BlackJack()
    return {"card": "A♠"}

@app.get("/games/black_jack/fold")
def read_item():
    pass

@app.get("/games/", response_class=HTMLResponse)
async def read_games(api_key: str = Security(get_api_key)):
    return FileResponse('HTML_files/games.html')


@app.get("/get_my_api_key/")
async def read_my_api_key(request : Request):
    client_ip = request.client.host
    return API_KEYS[client_ip]

@app.get("/get_coin_amount/{key}")
async def get_coin_amount(key):
    return str(KEYS_TO_COINS[key])

@app.get("/create_guest_acount/")
async def create_guest_acount(request : Request):
    client_ip = request.client.host
    my_api_key = key_gen()
    API_KEYS[client_ip] = my_api_key
    KEYS_TO_COINS[my_api_key] = 100
    return my_api_key