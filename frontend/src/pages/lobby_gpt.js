import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerList from '../components/PlayerList';

const Lobby = () => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) {
      const interval = setInterval(async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/2/lobbies/current_players');
        setPlayers(response.data.players);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [waiting]);

  const joinLobby = async () => {
    // TODO general lobby; not only 2.
    await axios.post(`http://127.0.0.1:8000/api/2/lobbies/${playerName}/join_lobby`);
    setWaiting(true);
  };

  const startGame = async () => {
    await axios.post('/api/start_game');
    // Handle the game start logic here
  };

  return (
    <div>
      <h1>Casino Lobby</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={joinLobby}>Join Lobby</button>
      <PlayerList players={players} />
      {players.length > 1 && (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default Lobby;
