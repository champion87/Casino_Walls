from enum import Enum
import itertools
import random
from typing import Dict, List
from fastapi.params import Path
from game import Game
from card_game import BlackJack

SESSIONS : Dict[str : Game] = {"id" : Game()}

GAMES : Dict[str : Game] = {
    "blackjack" : BlackJack
}

def get_session(session_key: str = Path()):
    return SESSIONS[session_key]

# @return None - if no such game was found at 'games::GAMES'
def get_game(game_name: str = Path()):
    return GAMES.get(game_name, None)

def set_session(key, game):
    SESSIONS[key] = game