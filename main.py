from typing import Union
from fastapi.responses import HTMLResponse
from fastapi import FastAPI


app = FastAPI()


@app.get("/", response_class=HTMLResponse)
async def read_root():
    return "<html><head><title>Casino Walls</title></head><body><h1>Welcome to Casino walls</h1><p>Here you can play games</p></body></html>"


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
