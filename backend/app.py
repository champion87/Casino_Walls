from __future__ import annotations
import asyncio
import logging
from time import sleep
import traceback
from typing import Any, Dict, List, MutableMapping, Union
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, StreamingResponse
import starlette
from starlette.exceptions import HTTPException
from fastapi import (
    Query,
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
from fastapi.middleware.cors import CORSMiddleware
import random
import math
import string

from starlette.types import Scope
from utils.my_log import LOG
import datetime
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
    #############
    ### REACT ###
    #############

    origins = [
        "http://localhost:3000",
        "localhost:3000",
        "http://localhost:3000/games",
        "localhost:3000/games",
        "http://localhost:8000"
    ]
    
    # origins = ["*"]

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

    
    @app_.get("/test")
    def test():
        return HTMLResponse("world")
    

    app_.mount("/", ReactStaticFiles(directory=r"C:\Users\lidor\me\arazim\casino\Casino_Walls\frontend\build", html=True), name="static")



    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s [in %(pathname)s:%(lineno)d]",
    )
    logger = logging.getLogger(__name__)
    
    # @app_.middleware("http")
    # async def log_requests(request: Request, call_next):
    #     try:
    #         response = await call_next(request)
    #     except Exception as e:
    #         logger.error(f"Error processing request: {str(e)}")
    #         tb = traceback.format_exc()
    #         logger.error(tb)
    #         response = JSONResponse(content={"detail": "Internal Server Error"}, status_code=500)
    #     finally:
    #         line_info = None
    #         for frame in traceback.extract_stack():
    #             if frame.name == "<module>" or frame.name == "log_requests":
    #                 continue
    #             line_info = f"{frame.filename}:{frame.lineno}"
    #             break
    #         # logger.info(f"Request: {request.method} {request.url} handled by {line_info}")
    #         logger.info(f"{e}")

    #     return response

    # # app_.add_middleware(log_requests)

    return app_
