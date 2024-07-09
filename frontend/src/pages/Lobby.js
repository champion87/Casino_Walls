import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { call_api } from 'src/lib/utils';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  let { lobby_key } = useParams();

  const [coinAmount, setCoinAmount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function get_coins(){
    const coin_res = await call_api("/api/coins/", "GET").then(response => response.json());
    setCoinAmount(parseInt(coin_res.coins));
  }

  useEffect(() => {
    get_coins();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await call_api(`/api/lobbies/${lobby_key}/is_game_started`, "get");
        const data = await response.json();

        if (data.is_started) {
          // console.log("game already started????")
          navigate(`/bjGPT/${data["session_key"]}`)
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gameStart:', error);
      }

      try {
        const response = await call_api(`/api/lobbies/${lobby_key}/current_players`, "get");
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

    fetchData();

    const interval = setInterval(fetchData, 1000); // Fetch players every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  async function BackToMainPage() {
    call_api(`/api/lobbies/${lobby_key}/leave_lobby`, "post")
    navigate("/blackjack_main")
  }

  const startGame = () => {
    console.log('Game started');
    call_api(`/api/lobbies/${lobby_key}/start_game`, "post")

    // Implement game start logic here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <p className="mt-2 text-yellow-200">
        coin amount: {coinAmount}
      </p>
      <button onClick={BackToMainPage}>Go Back</button>

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
