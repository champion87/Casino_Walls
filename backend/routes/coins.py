from fastapi import APIRouter, Depends

from .auth import get_user_name

router = APIRouter()

COINS = {}
last_claimed= {}
@router.get('/')
def get_coins(user_name: str = Depends(get_user_name)):
    return { "coins": COINS.setdefault(api_key, 100)}

@router.post("/claim")
async def claim_coins(user_name: str = Depends(get_user_name)):
    current_time = datetime.datetime.today()
    time_difference = current_time - last_claimed[user_name]
    if(time_difference.seconds < 3600 and time_difference.days == 0):
        available_in = 60 - int(time_difference.seconds / 60)
        return {"available_in" : available_in, "claimed" : "false"}
    
    last_claimed[user_name] = current_time
    coins[user_name] += 50
    return {"available_in" : 60, "claimed" : "true"}
