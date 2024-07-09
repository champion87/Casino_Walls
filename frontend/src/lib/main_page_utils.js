async function fetchLobbies(gameName) {
    try {
        const response = await call_api(`/api/lobbies/${gameName}`, "get");
        const data = await response.json();
        setLobbies(data.lobbies);
    } catch (error) {
        console.error('Error fetching lobbies:', error);
    }
    console.log(lobbies)
};