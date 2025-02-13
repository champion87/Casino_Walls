from fastapi import APIRouter, Cookie, Security, Response, Form, Depends
from fastapi.exceptions import HTTPException
from typing import Dict, Union
from fastapi import (
    HTTPException,
    Security,
    Cookie,
    Response,
    Form,
)
from fastapi.exceptions import HTTPException
import random
import string
from utils.my_log import LOG
from db import COINS
router = APIRouter()


USERNAME_TO_PASSWORD: Dict[str,str]  = {"lidor": "1234"}
API_KEYS: Dict[str, str] = {'1': 'lidor'}

class User:
    def __init__(self, name, password):
        self.name = name
        self.password = password
        
    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.__str__()


def key_gen():
    result_str = "".join(
        random.choice(string.ascii_letters + string.digits) for i in range(20)
    )
    return result_str



def api_key_query(api_key: Union[str, None] = Cookie(None)):
    return api_key


def get_api_key(
    api_key: str = Security(api_key_query),
) -> str:
    # LOG(f"{api_key = }")
    if api_key in API_KEYS.keys():
        return api_key
    raise HTTPException(status_code=401, detail="no valid token")


def get_user_name(
    api_key: str = Security(api_key_query),
) -> str:
    LOG(f"{api_key = }") 
    LOG(API_KEYS)
    if api_key in API_KEYS.keys():
        return API_KEYS[api_key]
    raise HTTPException(status_code=401, detail="no valid token")


@router.get("/user")
def get_user(user_name :str = Depends(get_user_name)):
    return {"user" : user_name}


@router.post("/create_guest_acount")
async def create_guest_acount(response: Response):
    my_api_key = key_gen()
    username = "guest" + str(len(API_KEYS))
    API_KEYS[my_api_key] = username
    COINS[username] = 100
    # LOG('got here')
    # response.set_cookie(key="api_key", value=my_api_key, samesite='none', secure=True)
    response.set_cookie(key="api_key", value=my_api_key)

    return {"status": "ok"}


@router.post("/create_account")
async def create_account(
    response: Response, username: str = Form(), password: str = Form()):
    if(username in USERNAME_TO_PASSWORD.keys()):
        return {"status": "username_taken"}
    USERNAME_TO_PASSWORD[username] = password
    my_api_key = key_gen()
    API_KEYS[my_api_key] = username
    COINS[username] = 100

    # response.set_cookie(key="api_key", value=my_api_key, samesite='none', secure=True)
    response.set_cookie(key="api_key", value=my_api_key)

    return {"status": "ok"}


@router.post("/login")
async def login(response: Response, username: str = Form(), password: str = Form()):
    if username not in USERNAME_TO_PASSWORD.keys():
        # LOG("user doesn't exist")
        return {"status": "not ok"}

    if USERNAME_TO_PASSWORD[username] != password:
        # LOG("incorrect password")
        # LOG(password)
        return {"status": "not ok"}

    my_api_key = key_gen()
    API_KEYS[my_api_key] = username

    # response.set_cookie(key="api_key", value=my_api_key, samesite='none', secure=True)
    response.set_cookie(key="api_key", value=my_api_key)

    return {"status": "ok"}


@router.post("/logout")
async def logout(response: Response, api_key: str = Security(get_api_key)):

    API_KEYS.pop(api_key)

    response.delete_cookie(key="api_key")
    return {"status": "ok"}
