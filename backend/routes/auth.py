from fastapi import APIRouter, Cookie, Security, Response, Form, Depends
from fastapi.exceptions import HTTPException
from typing import Dict, Union

from ..utils.my_log import LOG
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
    LOG(api_key)
    if api_key in API_KEYS.keys():
        return api_key
    raise HTTPException(status_code=401, detail="no valid token")


def get_user_name(
    api_key: str = Security(api_key_query),
) -> str:
    LOG(api_key)
    if api_key in API_KEYS.keys():
        return API_KEYS[api_key]
    raise HTTPException(status_code=401, detail="no valid token")


@router.get("/user")
def get_user(user_name :str = Depends(get_user_name)):
    return {"user" : user_name}


@router.get("/create_guest_acount/")
async def create_guest_acount(response: Response):
    new_user: User = User("guest", "")
    my_api_key = key_gen()
    USERS[my_api_key] = new_user
    LOG('got here')
    response.set_cookie(key="api_key", value=my_api_key, samesite='none', secure=True)
    return {"status": "ok"}


@router.post("/create_acount/")
async def create_acount(
    response: Response, username: str = Form(), password: str = Form
):
    new_user: User = User(username, password)
    USERNAME_TO_USER[username] = new_user
    my_api_key = key_gen()
    USERS[my_api_key] = new_user

    response.set_cookie(key="api_key", value=my_api_key, samesite='none', secure=True)
    return {"status": "ok"}


@router.post("/login/")
async def login(response: Response, username: str = Form(), password: str = Form):
    if username not in USERNAME_TO_USER.keys():
        return {"status": "not ok"}

    if USERNAME_TO_USER[username].password != password:
        return {"status": "not ok"}

    my_api_key = key_gen()
    USERS[my_api_key] = USERNAME_TO_USER[username]

    response.set_cookie(key="api_key", value=my_api_key, samesite='none', secure=True)
    return {"status": "ok"}


@router.get("/logout/")
async def logout(response: Response, api_key: str = Security(get_api_key)):

    USERS.pop(api_key)

    response.delete_cookie(key="api_key")
    return {"status": "ok"}
