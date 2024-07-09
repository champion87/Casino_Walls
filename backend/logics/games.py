from enum import Enum
import itertools
import random
from typing import Dict, List
from fastapi.params import Path, Query
from logics.game import Game
from logics.blackjack_logic import BlackJack
from utils.my_log import LOG


# GAMES : Dict[str , Game] = {
#     "blackjack" : BlackJack
# }



# @return None - if no such game was found at 'games::GAMES'
# def get_game(game_name: str = Query()):
#     LOG(f"got {game_name = }")
#     return GAMES.get(game_name, None)

