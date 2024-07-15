from fastapi import APIRouter, Depends, HTTPException, Path
from routes.auth import get_user_name
from utils.my_log import LOG
from logics.blackjack_logic import BlackJack
from routes.lobbies import get_session, SESSIONS
router = APIRouter()


@router.get('/get_score')
def get_score(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    return {"score" : game.get_score(username)}

@router.get('/get_dealer_score')
def BJ_restart_game(game:BlackJack = Depends(get_session)):
    return {"score" : game.get_dealer_score(game.is_game_over())}

@router.get('/get_hand')
def get_hand(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    try:
        return {"hand" : game.get_hand(username)}
    except:
        LOG(f"Player <{username}> called get_hand but it is no longer in the game")

@router.get('/get_other_hands')
def hands(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    return {
        "hands" : game.get_hands_for_show(username)
    }

@router.get('/get_dealer_hand')
def BJ_restart_game(game:BlackJack = Depends(get_session)):
    return  {"hand" : game.get_dealer_hand(game.is_game_over())}

    
@router.get('/is_game_over')
def is_game_over(game:BlackJack = Depends(get_session)):
    LOG(game.is_game_over())
    return {"is_game_over" : game.is_game_over()}

@router.post('/abort')
def abort(game:BlackJack = Depends(get_session), username: str = Depends(get_user_name)):
    game.abort(username)

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
    except Exception as e:
        LOG(e.args)
        if e.args[0] == "Game already started!":
            return {"was_restarted" : False}
        raise HTTPException(status_code=404, detail="session was not found")