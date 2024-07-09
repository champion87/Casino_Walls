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
import BJRulesButton from 'src/components/BJRulesButton';
import LobbyCard from 'src/components/LobbyCard';
import { fetchLobbies, create_lobby, join_lobby } from 'src/lib/main_page_utils';
import { LobbyList } from 'src/components/LobbyList';

export const BlackJackMainPage = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    fetchLobbies("blackjack", setLobbies);

    const intervalId = setInterval(() => {fetchLobbies("blackjack", setLobbies)}, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
}, []);

  async function play_singleplayer_bj() {
    const response = await call_api("/api/lobbies/create_lobby/blackjack/?prize=10&max_players=1", "post") // TODO generalize
    const data = await response.json()
    await call_api(`/api/lobbies/${data["lobby_key"]}/join_lobby/`, "post");
    await call_api(`/api/lobbies/${data["lobby_key"]}/start_game/`, "post");
    console.log("started game$$$$$$$$$$$$$$$$$")
    navigate(`/games/${data["session_key"]}/blackjack`) // TODO change to the real route

  }

  async function test() {
  
  }

  return (


    <div className="bg-[#690d0d] h-screen items-center p-10">
      <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
        <div className="my-4">
          <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
          <LobbyList gameName="blackjack" lobbies={lobbies}/>
          {/* {lobbies.map((lobby) => (
              <LobbyCard
                lobby_key={lobby.key}
                game_name={lobby.game_name}
                max_players={lobby.max_players}
                prize={lobby.prize}
                onJoin={async () => {navigate(`/blackjack_lobby/${await join_lobby(lobby.key)}`)}}
              />
          ))} */}
        </div>



        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Create a New Lobby</h1>
          </div>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack")}`)}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            create lobby
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
          <Button
            type="button"
            onClick={test}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            test
          </Button>

        </div>


      </div>
      <BJRulesButton />
    </div>
  )
}

