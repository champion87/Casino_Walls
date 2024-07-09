from typing import List, Dict
from logics.lobby import Lobby
from logics.game import Game

COINS = {}
############
### DATA ###
############

# USERNAME_TO_LOBBY = { "Lidor" : Lobby() }
LOBBIES: Dict[str, Lobby] = { } # BJ LOBBIES
POKER_LOBBIES: Dict[str, Lobby] = { }
SESSIONS : Dict[str , Game] = {"id" : Game()}

LOBBY_TO_SESSION : Dict[str, str] = {}
USERNAME_TO_LOBBY_KEY : Dict[str, str] = {}
