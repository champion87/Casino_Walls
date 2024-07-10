import { call_api } from "./utils";

export async function fetchLobbies(gameName, setLobbies) {
    try {
        const response = await call_api(`/api/lobbies/game/${gameName}`, "get");
        // const response = await call_api(`/api/lobbies/`, "get");

        const data = await response.json();
        setLobbies(data.lobbies);
    } catch (error) {
        console.error('Error fetching lobbies:', error);
    }
};

export async function create_lobby(gameName) {
    const response = await call_api(`/api/lobbies/create_lobby/${gameName}/?prize=10&max_players=4`, "post") // TODO generalize
    const data = await response.json()
    console.log("created lobby with key: " + data["lobby_key"])
    console.log("gamename: " + gameName)
    return data["lobby_key"]
}