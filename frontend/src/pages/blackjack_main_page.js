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
import { OngoingLobby } from 'src/components/OngoingLobby';
import { Label } from '@radix-ui/react-label';
import { call_api } from 'src/lib/utils';

function test(param) {
  console.log(param)
  console.log("oops")
}

export const BlackJackMainPage = () => {

  async function create_lobby() {
    console.log("creating lobby, wink wink.")
    call_api("api/lobbies/create_lobby/blackjack/?prize=10&max_players=4", "post") // TODO generalize
    // call_api("api/lobbies/create_lobby/test", "post")
  }

  async function join_lobby(key) {
    try {
      await call_api(`/api/lobbies/${key}/join_lobby/`, "POST");
      console.log(`Joined lobby with key: ${key}`);
    } catch (error) {
      console.error(`Failed to join lobby with key ${key}:`, error);
    }
  }

  const [lobbies, setLobbies] = useState([]);

  return (


    <div className="bg-[#690d0d] h-screen items-center p-10">
      <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
        <div className="my-4">
          <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
          <OngoingLobby onClick={() => join_lobby("1234")} />
          {lobbies.map((lobby) => (

            <div onClick={() => join_lobby(lobby.key)}>
              <OngoingLobby
                lobby_key={lobby.key}
                className="w-44 mt-2 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
              />
            </div>
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
      </div>
    </div>
  )
}

