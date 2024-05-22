from typing import Union
from fastapi.responses import HTMLResponse
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse

SYMBOLS = {
    "clubs" : "♣",
    "diamonds" : "♦",
    "hearts" : "♥",
    "spades" : "♠",
}

class card_t:
    symbol

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
async def read_root():
    return FileResponse('HTML_files/root_page.html')


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_item():
    return FileResponse('HTML_files/wheel_of_fortune.html')

@app.get("/games/black_jack/", response_class=HTMLResponse)
def read_item():
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

@app.get("/games/", response_class=HTMLResponse)
async def read_root():
    return FileResponse('HTML_files/games.html')
