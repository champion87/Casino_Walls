from fastapi import APIRouter

router = APIRouter()


LOBBY1: List[str] = []
LOBBY2: List[str] = []


GAMES: Dict[str, Game] = {}

@router.get("/join_lobby2")
def join_lobby2(key_passed: str = Security(get_api_key)):
    LOBBY2.append(USERS[key_passed])
    player_added_event.set()
    
    return {}


@app.get("/lobby2", response_class=HTMLResponse)
def read_lobby(key_passed: str = Security(get_api_key)):

    LOBBY2.append(key_passed)
    LOG(key_passed)

    return FileResponse("HTML_files/lobby.html")


@app.get("/sleeptest")
def test_async(key_passed: str = Security(get_api_key)):
    player_added_event.set()

    return {}


@app.get("/players")
async def players(key_passed: str = Security(get_api_key)):
    player_added_event.clear()
    await player_added_event.wait()
    LOG(player_added_event.is_set())
    LOG("done waiting\n")
    return {"players": LOBBY2}


@app.get("/lol")
def test_page(key_passed: str = Security(get_api_key), response_class=HTMLResponse):

    return FileResponse("HTML_files/lol.html")
