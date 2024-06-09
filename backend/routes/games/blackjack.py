from fastapi import APIRouter, Depends
from ...logics.card_game import get_game, Game
from ..auth import get_user_name
router = APIRouter()



@router.get('/get_state')
def get_game_state(game:Game = Depends(get_game), user_name: str = Depends(get_user_name)):
    pass


# @app.get("/games/black_jack/lobby1", response_class=HTMLResponse) #TODO 
# def read_black_jack(key_passed: str = Security(get_api_key)):
#     api_key = "3"  # TODO
#     # register_demo()

#     LOBBY1.append(api_key)

#     return FileResponse("HTML_files/black_jack_lobby.html")

# def BJ_end_game(bj):
#     LOG("BJ game ended!")
#     bj.end_game()
#     # TODO give money


# def is_enough_money(players: List[str], cost):
#     for api_key in players:
#         if USERS[api_key].coins < cost:
#             return False

#     return True



# @app.get("/games/black_jack/start_game_lobby1/{fee}")
# def BJ_start_game_lobby(
#     fee: int,
# ):  # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
#     LOG("BJ lobby 1!" + str(fee))

#     api_key = "3"  # TODO

#     bj = card_game.BlackJack(LOBBY1, fee)

#     for key in LOBBY1:
#         USERS[key].black_jack = bj
#         USERS[key].decrease_coins(
#             fee
#         )  # TODO this won't decrease ANY coins if the player doesn't have any. Ignoring this problem for now
#         asdf.append(bj)

#     LOG("LOOK HERE!")
#     LOG(USERS[api_key].black_jack)
#     LOG(asdf)

#     bj.start_game()
#     # LOG(bj.player_keys)
#     # LOG(bj.hands)
#     # LOG(bj)

#     LOG("started game")

#     return {"hello": "world"}

#     # return FileResponse('HTML_files/black_jack.html')
#     # return FileResponse('HTML_files/lol.html')


# @app.get("/games/black_jack/game", response_class=HTMLResponse)
# def get_game():
#     return FileResponse("HTML_files/black_jack.html")


# @app.get("/games/black_jack/get_status")
# def get_status(api_key: str = Security(get_api_key)):
#     return USERS[api_key].black_jack.get_player_json()


# @app.get("/games/black_jack/first_turn")
# def BJ_play():  # TODO for Daniel: do we need the 'key_passed: str = Security(get_api_key)' argument here too?
#     LOG("Let's play BJ!")

#     api_key = "3"  # TODO

#     LOG(USERS)
#     LOG(USERS[api_key])
#     LOG(USERS[api_key].black_jack)
#     LOG(asdf)

#     bj = USERS[api_key].black_jack

#     if bj.is_overdraft(api_key):
#         pass
#     if bj.is_game_over():
#         LOG("called endgame")
#         BJ_end_game(bj)
#     return bj.get_player_json(api_key)


# @app.get("/games/black_jack/draw")
# def BJ_draw():
#     LOG("draw")
#     api_key = "3"  # TODO
#     bj = USERS[api_key].black_jack

#     LOG(bj.status)

#     if card_game.GameStatus.NO_GAME == bj.status:
#         return bj.get_player_json(api_key)

#     bj.draw(api_key)
#     if bj.is_overdraft(api_key):
#         pass
#     if bj.is_game_over():
#         BJ_end_game(bj)
#         LOG("called endgame")

#     return bj.get_player_json(api_key)


# @app.get("/games/black_jack/fold")
# def BJ_fold():
#     LOG("fold")
#     api_key = "3"  # TODO
#     bj = USERS[api_key].black_jack

#     if card_game.GameStatus.NO_GAME == bj.status:
#         return bj.get_player_json(api_key)

#     BJ_end_game(bj)

#     return bj.get_player_json(api_key)

