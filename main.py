from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/games/wheel_of_fortune", response_class=)
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
