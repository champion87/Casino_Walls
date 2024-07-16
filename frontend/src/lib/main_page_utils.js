import { call_api } from "./utils";

export async function fetchLobbies(gameName, setLobbies) {
    try {
        const response = await call_api(`/api/lobbies/game/${gameName}`, "get");
        // const response = await call_api(`/api/lobbies`, "get");

        const data = await response.json();
        setLobbies(data.lobbies);
    } catch (error) {
        console.error('Error fetching lobbies:', error);
    }
};

export async function create_lobby(gameName, prize=0, max_players=4, bots=0) {
    var response;
    if (gameName == "poker") {
        response = await call_api(`/api/lobbies/create_lobby/${gameName}?max_players=${max_players}&bots=${bots}`, "post") // TODO generalize
    }
    else if (gameName == "blackjack")
    {
        response = await call_api(`/api/lobbies/create_lobby/${gameName}?max_players=${max_players}&prize=${prize}`, "post") // TODO generalize
    }
    else 
    {
        throw `create lobby got bad gameName: ${gameName}`
    }

    const data = await response.json()
    console.log("created lobby with key: " + data["lobby_key"])
    console.log("gamename: " + gameName)
    return data["lobby_key"]
}