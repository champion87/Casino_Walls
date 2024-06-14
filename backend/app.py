from __future__ import annotations
import asyncio
from time import sleep
from typing import Dict, List, Union
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from fastapi import (
    HTTPException,
    status,
    Security,
    FastAPI,
    Request,
    Cookie,
    Response,
    Form,
)
from pydantic import BaseModel
from starlette.responses import FileResponse
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import math
import string
from utils.my_log import LOG
import datetime


def create_app():

    app_ = FastAPI()

    #############
    ### REACT ###
    #############

    origins = [
        "http://localhost:3000",
        "localhost:3000",
        "http://localhost:3000/games",
        "localhost:3000/games"
    ]


    app_.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["GET", "POST"],
            allow_headers=["*"]
    )


    from routes.auth import router as auth_router
    app_.include_router(auth_router, prefix='/api/auth')

    from routes.lobbies import router as lobbies_router
    app_.include_router(lobbies_router, prefix='/api/{lobby_key}/lobbies')

    from routes.games import router as games_router
    app_.include_router(games_router, prefix='/api/games')

    from routes.coins import router as coins_router
    app_.include_router(coins_router, prefix='/api/coins')

    return app_