from fastapi import APIRouter, Depends, Path
from routes.lobbies import get_session, SESSIONS
from logics.card_game import Poker
from routes.auth import get_user_name


router = APIRouter()



@router.get('/get_hand')
def get_hand(game:Poker = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hand" : game.get_hand(username).to_list_of_str()}

@router.get('/get_board')
def Poker_board(game:Poker = Depends(get_session)):
    return {"board" : game.get_board().to_list_of_str()}

@router.post('/check')
def BJ_draw(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.stand(user_name) #TODO try except

@router.post('/call')
def BJ_draw(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.call(user_name) #TODO try except

@router.post('/raise')
def BJ_draw(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.call(user_name) #TODO try except

@router.post('/fold')
def BJ_fold(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.fold(user_name) #TODO try except

@router.post('/try_restart_game')
def Poker_restart_game(game:Poker = Depends(get_session)):
    try:     
        game.start_game() #TODO try except
        return {"was_restarted" : True}
    except:
        return {"was_restarted" : False}
    
@router.post('/get_player_count')
def BJ_draw(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    return {"num" : game.get_player_count()} #TODO try except

        