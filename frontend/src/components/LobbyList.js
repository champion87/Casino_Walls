import LobbyCard from "./LobbyCard"
import { useNavigate } from "react-router-dom";
import { join_lobby } from "src/lib/main_page_utils";

export const LobbyList = ({ gameName, lobbies }) => {
    const navigate = useNavigate();

    return (
        <>
            {lobbies.map((lobby) => (
                <LobbyCard
                    key={lobby.key}
                    lobby_key={lobby.key}
                    game_name={lobby.game_name}
                    max_players={lobby.max_players}
                    prize={lobby.prize}
                    onJoin={async () => { navigate(`/${gameName}_lobby/${await join_lobby(lobby.key)}`) }}
                />
            ))}
        </>
    )
}
