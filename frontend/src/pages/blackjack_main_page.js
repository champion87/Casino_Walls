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


    <div className="bg-[#690d0d] h-screen items-center p-10">
      <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
        <div className="my-4">
          <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
          <LobbyList gameName="blackjack" lobbies={lobbies}/>
        </div>



        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Create a New Lobby</h1>
          </div>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 10)}`)}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            new lobby - 10$
          </Button>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 25)}`)}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            new lobby - 25$
          </Button>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 100)}`)}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            new lobby - 100$
          </Button>

        </div>

        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">Single Player</h1>
          </div>
          <Button
            type="button"
            onClick={async () => {navigate(`/blackjack_lobby/${await create_lobby("blackjack", 10, 1)}`)}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            single player lobby - 10$
          </Button>
    
          <Button
            type="button"
            onClick={() => {navigate("/games")}}
            className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
          >
            back to games screen
          </Button>

        </div>


      </div>
      <BJRulesButton />
    </div>
  )
}

