from typing import Union
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import HTTPException, status, Security, FastAPI, Request, Cookie, Response
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.exceptions import HTTPException
import random
import string


SYMBOLS = {
    "clubs" : "♣",
    "diamonds" : "♦",
    "hearts" : "♥",
    "spades" : "♠",
}

# class card_t:
#     symbol 

API_KEYS = []
KEYS_TO_COINS = {}
app = FastAPI()


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

@app.get("/games/black_jack/start_game")
def read_item():
    pass

@app.get("/games/black_jack/draw")
def BJ_draw(api_key):
    return {"card": "A♠"}

@app.get("/games/black_jack/fold")
def read_item():
    pass


@app.get("/get_my_api_key/")
async def read_my_api_key(request : Request):
    client_ip = request.client.host
    return API_KEYS[client_ip]

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
