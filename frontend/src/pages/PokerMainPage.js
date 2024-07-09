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
import PokerRulesButton from 'src/components/PokerRules';


export const PokerMainPage = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    fetchLobbies("poker", setLobbies);

    const intervalId = setInterval(() => { fetchLobbies("poker", setLobbies) }, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  async function play_singleplayer_poker() {

  }

  return (


    <div className="bg-[#690d0d] h-screen items-center p-10">
      <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
        <div className="my-4">
          <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
          <LobbyList gameName="poker" lobbies={lobbies} />
          <div />
        </div>



        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Create a New Lobby</h1>
          </div>
          <Button
            type="button"
            onClick={async () => { navigate(`/poker_lobby/${await create_lobby("poker")}`) }}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            create lobby
          </Button>
          <Button
            type="button"
            onClick={() => {navigate("/games")}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            back to games screen
          </Button>
        </div>

        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Single Player</h1>
          </div>
          <Button
            type="button"
            onClick={play_singleplayer_poker}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            single player -
            not yet supported
          </Button>


        </div>


      </div>
      <PokerRulesButton />
    </div>
  )
}

