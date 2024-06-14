from enum import Enum
import itertools
import random
from typing import Dict, List
from fastapi.params import Path, Query
from logics.game import Game
from logics.card_game import BlackJack
from utils.my_log import LOG

SESSIONS : Dict[str , Game] = {"id" : Game()}

GAMES : Dict[str , Game] = {
    "blackjack" : BlackJack
}

def get_session(session_key: str = Path()):
    LOG(f"got {session_key = }")
    return SESSIONS[session_key]

# @return None - if no such game was found at 'games::GAMES'
def get_game(game_name: str = Query()):
    LOG(f"got {game_name = }")
    return GAMES.get(game_name, None)

def set_session(key, game):
    SESSIONS[key] = game