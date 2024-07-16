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
import { fetchLobbies, create_lobby } from 'src/lib/main_page_utils';
import { LobbyList } from 'src/components/LobbyList';

export const BlackJackMainPage = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    fetchLobbies("blackjack", setLobbies);

    const intervalId = setInterval(() => {fetchLobbies("blackjack", setLobbies)}, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
}, []);

  return (


    <div className="bg-wall bg-cover h-screen w-screen items-center p-10 overflow-y-scroll">
      <div className="bg-black inline-block items-center justify-center p-5 flex-col rounded-3xl">
        <div className="my-4">
          <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
          <LobbyList gameName="blackjack" lobbies={lobbies}/>
        </div>



        <div className=" flex items-center justify-center m-5 flex-col">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Create a New Lobby</h1>
          </div>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 10)}`)}}
            className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
          >
            New Lobby - 10$
          </Button>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 25)}`)}}
            className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
          >
            New Lobby - 25$
          </Button>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 100)}`)}}
            className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
          >
            New Lobby - 100$
          </Button>
          </div>


        <div className=" flex items-center justify-center m-5 flex-col">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Single Player</h1>
          </div>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 10, 1)}`)}}
            className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
          >
            Single Player Lobby - 10$
          </Button>
    
          <Button
            type="button"
            onClick={() => {navigate("/games")}}
            className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
          >
            Back to Games Screen
          </Button>

        </div>


      </div>
      <BJRulesButton />
    </div>
  )
}

