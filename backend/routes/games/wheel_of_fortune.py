from fastapi import APIRouter

router = APIRouter()



@router.get("/games/wheel_of_fortune/get_coins")
def get_coins(api_key: str = Security(get_api_key)):
    return {"coins": USERS[api_key].coins}


@app.get("/images/coinpic.png", response_class=StreamingResponse)
def send_coinpic(api_key: str = Security(get_api_key)):
    return FileResponse("HTML_files/coinpic.png")


@app.get("/games/wheel_of_fortune/spin_wheel/{bet_percentage}")
def generate_random_prize(bet_percentage, api_key: str = Security(get_api_key)):
    bet_percentage = int(bet_percentage)
    if bet_percentage < 0 or bet_percentage > 100:
        return {"prize": 0, "coins": USERS[api_key].coins, "bet_money": 0}
    possible_prizes_list = [0.1, 19, 0.3, 1.7, 0.5, 0, 1.5, 0.7, 1.3, 0.9, 1.1]
    # make it less uniform and more close to a normal distribution, maybe using sum of bernulli random variables

    current_money = USERS[api_key].coins
    bet_money = (bet_percentage * current_money) // 100
    prize = math.floor(bet_money * random.choice(possible_prizes_list))
    USERS[api_key].coins += prize - bet_money
    return {"prize": prize, "coins": USERS[api_key].coins, "bet_money": bet_money}
