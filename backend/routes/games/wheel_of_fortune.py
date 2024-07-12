from fastapi import APIRouter, Security, Depends
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from routes.auth import get_user_name
import math
import random
from ..coins import COINS

router = APIRouter()


@router.get("/spin_wheel_slider/{bet}")
def generate_random_prize(bet, username=Depends(get_user_name)):
    try:
        bet = int(bet)
    except:
        return {"prize": 0, "coins": COINS[username], "bet": 0, "mult": 0}

    current_money = COINS[username]
    if bet < 0 or bet > current_money:
        return {"prize": 0, "coins": COINS[username], "bet_money": 0}
    # possible_prizes_list = [0.1, 1.9, 0.3, 1.7, 0.5, 0, 1.5, 0.7, 1.3, 0.9, 1.1]
    possible_prizes_list = [0.5, 1.5, 0.7, 1.2, 0.9, 1.1]

    # make it less uniform and more close to a normal distribution, maybe using sum of bernulli random variables
    multiplier = random.choice(possible_prizes_list)
    prize = math.floor(bet * multiplier)
    COINS[username] += prize - bet
    return {"prize": prize, "coins": COINS[username], "bet": bet, "mult": multiplier}


@router.get("/get_coins")
def get_coins(username=Depends(get_user_name)):
    return {"coins": COINS[username]}


@router.get("/get_spin")
def get_coins(username=Depends(get_user_name)):
    possible_prizes = list(range(1, 7))
    n = random.choice(possible_prizes)
    message = "Prize " + str(n)
    return {"prize": message}


@router.get("", response_class=HTMLResponse)
def read_item(username=Depends(get_user_name)):
    return FileResponse("/")  # HTML_files/wheel_of_fortune.html


@router.get("/images/coinpic.png", response_class=StreamingResponse)
def send_coinpic(username=Depends(get_user_name)):
    return FileResponse("HTML_files/coinpic.png")
