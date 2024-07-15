from __future__ import annotations
import logging
from typing import Any,  MutableMapping
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.exceptions import HTTPException
from fastapi import (
    FastAPI,
    Response,
)
from fastapi.middleware.cors import CORSMiddleware

from starlette.types import Scope
from utils.my_log import LOG
from fastapi.staticfiles import StaticFiles

class ReactStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope: MutableMapping[str, Any]) -> Response:
        LOG(f'HERE {path}')
        try:
            return await super().get_response(path, scope)
        except HTTPException as e:
            if e.status_code == 404:
                return await super().get_response('.', scope)
            if e.status_code == 405:
                return JSONResponse({"BASA":"SABABA"})
            raise 
    
    
def create_app():

    app_ = FastAPI(openapi_url="/api/openapi.json", docs_url="/api/docs")

    origins = [
        "http://localhost:3000",
        "localhost:3000",
        "http://localhost:3000/games",
        "localhost:3000/games",
        "http://localhost:8000"
    ]
    
    app_.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

    from routes.auth import router as auth_router

    app_.include_router(auth_router, prefix="/api/auth")

    from routes.lobbies import router as lobbies_router

    

    app_.include_router(lobbies_router, prefix="/api/lobbies")

    from routes.games import router as games_router

    app_.include_router(games_router, prefix="/api/games")

    from routes.coins import router as coins_router

    app_.include_router(coins_router, prefix="/api/coins")

    # app_.mount("/", ReactStaticFiles(directory=r"frontend/build", html=True), name="static")

    return app_
