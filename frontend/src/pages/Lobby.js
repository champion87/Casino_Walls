// import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// import PlayerList from '../components/PlayerList';
// import {call_api} from '../lib/utils'
// import { useParams } from 'react-router-dom';

// const Lobby = () => {
//   let { lobby_key } = useParams();

//   const [playerName, setPlayerName] = useState('');
//   const [players, setPlayers] = useState([]);
//   const [waiting, setWaiting] = useState(false);

//   useEffect(() => {
//     if (waiting) {
//       const interval = setInterval(async () => {
//         const response = await call_api(`api/${lobby_key}/lobbies/current_players`, 'get');
//         const json = await response.json()
//         setPlayers(json.players);
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [waiting]);

//   const joinLobby = async () => {
//     // TODO general lobby; not only 2.
//     await call_api('api/lobbies/2/join_lobby', 'post')
//     setWaiting(true);
//   };

//   const startGame = async () => {
//     await call_api('api/start_game', 'post')
//     // Handle the game start logic here
//   };

//   return (
//     <div>
//       <h1>Casino Lobby</h1>
//       {/* <input
//         type="text"
//         value={playerName}
//         onChange={(e) => setPlayerName(e.target.value)}
//         placeholder="Enter your name"
//       /> */}
//       <button onClick={joinLobby}>Join Lobby</button>
//       <PlayerList players={players} />
//       {players.length > 1 && (
//         <button onClick={startGame}>Start Game</button>
//       )}
//     </div>
//   );
// };

// export default Lobby;

import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { call_api } from 'src/lib/utils';

const Lobby = () => {
  let { lobby_key } = useParams();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await call_api(`api/lobbies/${lobby_key}/current_players`, "get");
        const data = await response.json();
        setPlayers(data.players);
        setLoading(false);
        console.log("players:")
        console.log(data.players)
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    };

    fetchPlayers();

    const interval = setInterval(fetchPlayers, 5000); // Fetch players every 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const startGame = () => {
    console.log('Game started');
    // Implement game start logic here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Lobby</h1>
      <ul style={styles.playerList}>
        {players.map((player, index) => (
          <li key={index} style={styles.playerItem}>{player}</li>
        ))}
      </ul>
      <button onClick={startGame} style={styles.startButton}>Start Game</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  playerList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1rem',
    width: '200px',
    textAlign: 'left',
  },
  playerItem: {
    background: '#545309',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    borderRadius: '5px',
  },
  startButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    background: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    transition: 'background 0.3s ease',
  },
};

export default Lobby;
