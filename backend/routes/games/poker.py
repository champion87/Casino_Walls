from fastapi import APIRouter, Depends, Path
from routes.lobbies import get_session, SESSIONS
from logics.poker_logic import Poker
from routes.auth import get_user_name
from utils.my_log import LOG


router = APIRouter()



@router.get('/info')
def get_hand(game:Poker = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hand" : game.get_hand(username), "my_bet" : game.get_player_bet(username),
            "board" : game.export_board(), "pot" : game.get_pot(),
            "current_bet" : game.get_current_bet(), "player" : game.get_current_player(),
            "phase" : game.get_game_phase(), "bets" : game.get_bets(), "num" : game.get_player_num(username),
            "hands" : game.get_hands_for_show(username), "player_name" : game.get_current_player_name(),
            "username" : username, "winners" : game.get_winners(), "winning_hand" : game.get_winning_hand(),
            "coins" : game.get_users_coins(), "can_check": game.can_check(username),
            "can_call": game.can_call(username)}

@router.get('/get_hand')
def get_hand(game:Poker = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hand" : game.get_hand(username).to_list_of_str()}

@router.get('/get_hands')
def get_hand(game:Poker = Depends(get_session), username: str = Depends(get_user_name)):
    return {"hands" : game}

@router.get('/get_my_bet')
def get_hand(game:Poker = Depends(get_session), username: str = Depends(get_user_name)):
    return {"my_bet" : game.player_bet(username)}
    

@router.get('/get_board')
def Poker_board(game:Poker = Depends(get_session)):
    return {"board" : game.get_board().to_list_of_str()}

@router.get('/get_pot')
def get_pot(game:Poker = Depends(get_session)):
    return {"pot" : game.get_pot()}

@router.get('/get_current_bet')
def get_current_bet(game:Poker = Depends(get_session)):
    return {"current_bet" : game.get_current_bet()}

@router.get('/get_current_player')
def get_current_player(game:Poker = Depends(get_session)):
    return {"player" : game.get_current_player()}

@router.get('/get_current_player_name')
def get_current_player(game:Poker = Depends(get_session)):
    return {"player_name" : game.get_current_player_name()}

@router.get('/get_game_phase')
def get_current_player(game:Poker = Depends(get_session)):
    return {"phase" : game.get_game_phase()}

@router.get('/get_bets')
def get_current_player(game:Poker = Depends(get_session)):
    return {"bets" : game.get_bets()}

@router.post('/check')
def Poker_check(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    LOG("CHECK")
    game.stand(user_name) 

@router.post('/call')
def Poker_call(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.call(user_name) 

@router.post('/raise/{raise_amount}')
def Poker_raise(raise_amount : str, game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    if (raise_amount.isdigit()):
        game.my_raise(user_name, int(raise_amount)) 

@router.post('/fold')
def Poker_fold(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    game.fold(user_name) 

@router.post('/try_restart_game')
def Poker_restart_game(game:Poker = Depends(get_session)):
    try:     
        game.start_game() 
        return {"was_restarted" : True}
    except:
        return {"was_restarted" : False}
    
@router.get('/get_player_amount')
def get_player_amount(game:Poker = Depends(get_session), user_name: str = Depends(get_user_name)):
    return {"amount" : game.get_player_count()} 

        