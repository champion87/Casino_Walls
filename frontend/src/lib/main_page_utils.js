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

    await join_lobby(data["lobby_key"])
    return data["lobby_key"]
}

export async function join_lobby(key) {
    try {
        await call_api(`/api/lobbies/${key}/join_lobby/`, "post");
        console.log(`Joined lobby with key: ${key}`);
        return key
    } catch (error) {
        console.error(`Failed to join lobby with key ${key}:`, error);
        throw "oof"
    }
}