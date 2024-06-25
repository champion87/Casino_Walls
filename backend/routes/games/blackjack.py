from fastapi import APIRouter, Depends, Path
from logics.card_game import Game
# from logics.games import get_game
from routes.auth import get_user_name
from utils.my_log import LOG
from logics.card_game import BlackJack
from routes.lobbies import get_session, SESSIONS
router = APIRouter()


@router.get('/get_score')
def get_score(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    # LOG(game.get_player_json())
    return {"score" : game.get_score(username)}

@router.get('/get_hand')
def get_hand(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    # LOG(game.get_player_json())
    # LOG(p)
    # LOG(SESSIONS)
    # LOG("HAND")
    return {"hand" : game.get_hand(username)}
    # return {"hand" : ["123"]}


# @router.get('/get_state')
# def get_game_state(game:BlackJack = Depends(get_game), user_name: str = Depends(get_user_name)):
#     LOG("get_state")
#     LOG(game.get_player_json())
#     return game.get_player_json()

@router.post('/draw')
def BJ_draw(game:Game = Depends(get_session), user_name: str = Depends(get_user_name)):
    LOG("draw")
#     LOG(game.status)

@router.post('/fold')
def BJ_fold(game:Game = Depends(get_session), user_name: str = Depends(get_user_name)):
    LOG("fold")
#     if card_game.GameStatus.NO_GAME == bj.status:
#         return bj.get_player_json(api_key)

#     BJ_end_game(bj)

#     return bj.get_player_json(api_key)



#     if card_game.GameStatus.NO_GAME == bj.status:
#         return bj.get_player_json(api_key)

#     bj.draw(api_key)
#     if bj.is_overdraft(api_key):
#         pass
#     if bj.is_game_over():
#         BJ_end_game(bj)
#         LOG("called endgame")

#     return bj.get_player_json(api_key)


# def BJ_end_game(bj):
#     LOG("BJ game ended!")
#     bj.end_game()
#     # TODO give money


# def is_enough_money(players: List[str], cost):
#     for api_key in players:
#         if USERS[api_key].coins < cost:
#             return False

#     return True



# @app.get("/games/black_jack/fold")
