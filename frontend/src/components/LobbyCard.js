import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { call_api } from 'src/lib/utils';

const LobbyCard = ({ lobby_key, game_name, maxPlayers, prize, onJoin }) => {
    const [currentPlayers, setCurrentPlayers] = useState(0);

    useEffect(() => {
        const fetchPlayerCount = async () => {
            try {
                const response = await call_api(`api/lobbies/${lobby_key}/player_count`, "get");
                const data = await response.json();
                setCurrentPlayers(data.currentPlayers);
            } catch (error) {
                console.error('Error fetching player count:', error);
            }
        };

        fetchPlayerCount();

        const intervalId = setInterval(fetchPlayerCount, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [lobby_key]);

    return (
        <div className="lobby-card bg-white shadow-md rounded-lg p-4 m-4 w-64">
            <h2 className="text-xl text-gray-700 font-bold mb-0">{game_name} - {prize}$</h2>
            <p className="text-gray-300 mb-2">
                {lobby_key}
            </p>
            <p className="text-gray-700 mb-4">
                Players: {currentPlayers} / {maxPlayers}
            </p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onJoin}
            >
                JOIN
            </button>
        </div>
    );
};

LobbyCard.propTypes = {
    lobby_key: PropTypes.string.isRequired,
    game_name: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired,
    onJoin: PropTypes.func.isRequired,
};

export default LobbyCard;


// TODO!