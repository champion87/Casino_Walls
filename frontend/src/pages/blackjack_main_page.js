import {
  React,
  useEffect,
  useState,
  useContext
} from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import '../App.css';
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';
import { Label } from '@radix-ui/react-label';
import { call_api } from 'src/lib/utils';
// import ButtonWithRules from 'src/components/ButtonWithRules';
import BJRulesButton from 'src/components/BJRulesButton';
import LobbyCard from 'src/components/LobbyCard';

export const BlackJackMainPage = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    const fetchLobbies = async () => {
        try {
            const response = await call_api(`api/lobbies/`, "get");
            const data = await response.json();
            setLobbies(data.lobbies);
        } catch (error) {
            console.error('Error fetching lobbies:', error);
        }
        console.log(lobbies)
    };

    fetchLobbies();

    const intervalId = setInterval(fetchLobbies, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
}, []);

  async function play_singleplayer_bj() {
    const response = await call_api("api/lobbies/create_lobby/blackjack/?prize=10&max_players=1", "post") // TODO generalize
    const data = await response.json()
    await call_api(`api/lobbies/${data["lobby_key"]}/join_lobby/`, "post");
    await call_api(`api/lobbies/${data["lobby_key"]}/start_game/`, "post");
    console.log("started game$$$$$$$$$$$$$$$$$")
    // throw "started game"
    navigate(`/bjGPT/${data["session_key"]}`) // TODO change to the real route

  }

  async function create_lobby() {
    console.log("creating lobby, wink wink.")
    const response = await call_api("api/lobbies/create_lobby/blackjack/?prize=10&max_players=4", "post") // TODO generalize
    const data = await response.json()
    join_lobby(data["lobby_key"])
    // call_api("api/lobbies/create_lobby/test", "post")
  }

  async function join_lobby(key) {
    try {
      await call_api(`api/lobbies/${key}/join_lobby/`, "post");
      console.log(`Joined lobby with key: ${key}`);
      navigate(`/lobby/${key}`) // TODO change to the real route

    } catch (error) {
      console.error(`Failed to join lobby with key ${key}:`, error);
      throw "oof"
    }
  }


  return (


    <div className="bg-[#690d0d] h-screen items-center p-10">
      <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
        <div className="my-4">
          <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
          {lobbies.map((lobby) => (
              <LobbyCard
                // className="w-44 mt-2 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
                lobby_key={lobby.key}
                game_name={lobby.game_name}
                max_players={lobby.max_players}
                prize={lobby.prize}
                onJoin={() => {join_lobby(lobby.key)}}
              />
          ))}
          <div />
        </div>



        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Create a New Lobby</h1>
          </div>
          <Button
            type="button"
            onClick={create_lobby}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            create_lobby
          </Button>

        </div>

        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Single Player</h1>
          </div>
          <Button
            type="button"
            onClick={play_singleplayer_bj}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            play_bj
          </Button>

        </div>


      </div>
      <BJRulesButton />
    </div>
  )
}

