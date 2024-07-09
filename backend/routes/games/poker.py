from fastapi import APIRouter, Depends, Path
from routes.lobbies import get_session, SESSIONS
from logics.poker_logic import Poker
from routes.auth import get_user_name


router = APIRouter()



@router.get('/get_hand')
def get_hand(game:Poker = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hand" : game.get_hand(username).to_list_of_str()}

@router.get('/get_board')
def Poker_board(game:Poker = Depends(get_session)):
    return {"board" : game.get_board().to_list_of_str()}

@router.get('/get_pot')
def get_pot(game:Poker = Depends(get_session)):
    return {"pot" : game.get_pot()}

@router.get('/get_current_bet')
def get_current_bet(game:Poker = Depends(get_session)):
    return {"bet" : game.get_current_bet()}

@router.get('/get_current_player')
def get_current_player(game:Poker = Depends(get_session)):
    return {"player" : game.get_current_player()}

@router.post('/check')
def Poker_check(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.stand(user_name) #TODO try except

@router.post('/call')
def Poker_call(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.call(user_name) #TODO try except

@router.post('/raise')
def Poker_raise(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.my_raise(user_name) #TODO try except

@router.post('/fold')
def Poker_fold(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.fold(user_name) #TODO try except

@router.post('/try_restart_game')
def Poker_restart_game(game:Poker = Depends(get_session)):
    try:     
        game.start_game() #TODO try except
        return {"was_restarted" : True}
    except:
        return {"was_restarted" : False}
    
@router.post('/get_player_amount')
def get_player_amount(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    return {"num" : game.get_player_amount()} #TODO try except

        