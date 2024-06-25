from fastapi import APIRouter, Depends, Path
from logics.card_game import Game
from routes.auth import get_user_name
from utils.my_log import LOG
from logics.card_game import BlackJack
from routes.lobbies import get_session, SESSIONS
router = APIRouter()


@router.get('/get_score')
def get_score(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    return {"score" : game.get_score(username)}


@router.get('/get_hand')
def get_hand(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hand" : game.get_hand(username)}


@router.post('/draw')
def BJ_draw(game:BlackJack = Depends(get_session), user_name: str = Depends(get_user_name)):
    LOG("draw")
    game.draw(user_name) #TODO try except


@router.post('/fold')
def BJ_fold(game:BlackJack = Depends(get_session), user_name: str = Depends(get_user_name)):
    LOG("fold")
    game.fold(user_name) #TODO try except

@router.post('/restart_game')
def BJ_restart_game(game:BlackJack = Depends(get_session)):
    game.start_game()

# @router.get('/get_state')
# def get_game_state(game:BlackJack = Depends(get_game), user_name: str = Depends(get_user_name)):
#     LOG("get_state")
#     LOG(game.get_player_json())
#     return game.get_player_json()