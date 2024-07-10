import LobbyCard from "./LobbyCard"
import { useNavigate } from "react-router-dom";

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
                    onJoin={async () => { navigate(`/${gameName}_lobby/${lobby.key}`) }}
                />
            ))}
        </>
    )
}
