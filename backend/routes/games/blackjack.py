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

@router.get('/get_dealer_score')
def BJ_restart_game(game:BlackJack = Depends(get_session)):
    dealer_hand = game.get_dealer_hand()
    if game.is_game_over():
        return {"score" : dealer_hand.get_BJ_score()}
    else:
        return {"score" : dealer_hand.cards[0].get_BJ_value()}

@router.get('/get_hand')
def get_hand(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hand" : game.get_hand(username).to_list_of_str()}

@router.get('/get_other_hands')
def hands(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    return {
        "hands" : game.get_hands_for_show(username)
    }

@router.get('/get_dealer_hand')
def BJ_restart_game(game:BlackJack = Depends(get_session)):
    dealer_hand = game.get_dealer_hand()
    if game.is_game_over():
        return {"hand" : dealer_hand.to_list_of_str()}
    else:
        return {"hand" : [str(dealer_hand.cards[0]), "xxxx\n"*3]}
    
@router.get('/is_game_over')
def is_game_over(game:BlackJack = Depends(get_session)):
    LOG(game.is_game_over())
    return {"is_game_over" : game.is_game_over()}


@router.post('/draw')
def BJ_draw(game:BlackJack = Depends(get_session), user_name: str = Depends(get_user_name)):
    try:
        game.draw(user_name)
    except:
        LOG("shit happens: sometimes 'fold' is accidently called twice for some reason. Nevermind.")

@router.post('/fold')
def BJ_fold(game:BlackJack = Depends(get_session), user_name: str = Depends(get_user_name)):
    LOG("I TRY FOLD")
    try:
        game.fold(user_name)
    except:
        LOG("shit happens: sometimes 'fold' is accidently called twice for some reason. Nevermind.")
        

@router.post('/try_restart_game')
def BJ_restart_game(game:BlackJack = Depends(get_session)):
    try:     
        game.start_game()
        return {"was_restarted" : True}
    except:
        return {"was_restarted" : False}
        
        
    


# @router.get('/get_state')
# def get_game_state(game:BlackJack = Depends(get_game), user_name: str = Depends(get_user_name)):
#     LOG("get_state")
#     LOG(game.get_player_json())
#     return game.get_player_json()