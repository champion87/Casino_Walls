import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import PlayerList from '../components/PlayerList';
import {call_api} from '../lib/utils'
import { useParams } from 'react-router-dom';

const Lobby = () => {
  let { lobby_key } = useParams();

  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) {
      const interval = setInterval(async () => {
        const response = await call_api(`api/${lobby_key}/lobbies/current_players`, 'get');
        const json = await response.json()
        setPlayers(json.players);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [waiting]);

  const joinLobby = async () => {
    // TODO general lobby; not only 2.
    await call_api('api/lobbies/2/join_lobby', 'post')
    setWaiting(true);
  };

  const startGame = async () => {
    await call_api('api/start_game', 'post')
    // Handle the game start logic here
  };

  return (
    <div>
      <h1>Casino Lobby</h1>
      {/* <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
      /> */}
      <button onClick={joinLobby}>Join Lobby</button>
      <PlayerList players={players} />
      {players.length > 1 && (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default Lobby;
