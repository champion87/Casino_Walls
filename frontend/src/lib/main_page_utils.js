import { call_api } from "./utils";

export async function fetchLobbies(gameName, setLobbies) {
    try {
        // const response = await call_api(`/api/lobbies/${gameName}`, "get");
        const response = await call_api(`/api/lobbies/`, "get");

        const data = await response.json();
        setLobbies(data.lobbies);
    } catch (error) {
        console.error('Error fetching lobbies:', error);
    }
};