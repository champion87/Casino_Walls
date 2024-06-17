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



export const BlackJackMainPage = () => {

  async function create_lobby() {
    console.log("creating lobby, wink wink.")
    // call_api()
  }

  return (

    <div>
      <div className="bg-[#690d0d] h-screen items-center p-10">
        <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
          <div className="my-4">
            <h1 className="text-3xl font-bold text-yellow-400">On Going Lobbies</h1>
            <OngoingLobby />
          </div>
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

