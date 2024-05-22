from typing import Union
from fastapi.responses import HTMLResponse
from fastapi import HTTPException, status, Security, FastAPI, Request
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
import random
import string

API_KEYS = {}
app = FastAPI()


api_key_query = APIKeyQuery(name="api-key", auto_error=False)
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

def key_gen():
    result_str = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(20))
    return result_str
    

def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
) -> str:
    """Retrieve and validate an API key from the query parameters or HTTP header.

    Args:
        api_key_query: The API key passed as a query parameter.
        api_key_header: The API key passed in the HTTP header.

    Returns:
        The validated API key.

    Raises:
        HTTPException: If the API key is invalid or missing.
    """
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
    client_ip = request.client
    my_api_key = key_gen()
    API_KEYS[client_ip] = my_api_key
    return FileResponse('HTML_files/root_page.html')


@app.get("/games/wheel_of_fortune/", response_class=HTMLResponse)
def read_item():
    return FileResponse('HTML_files/wheel_of_fortune.html')


@app.get("/games/", response_class=HTMLResponse)
async def read_games(api_key: str = Security(get_api_key)):
    return FileResponse('HTML_files/games.html')


@app.get("/get_my_api_key/")
async def read_my_api_key(request : Request):
    client_ip = request.client
    return API_KEYS[client_ip]