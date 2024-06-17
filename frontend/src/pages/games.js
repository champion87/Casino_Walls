import {
    React, 
    useEffect,
    useState,
    useContext} from 'react';
  import {
    Outlet,
    useNavigate,
    useParams,
   } from "react-router-dom";
import '../App.css';
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';
import { Label } from '@radix-ui/react-label';



export const GamesLobbyPage = () =>  {
  const {userData, forceUpdate} = useContext(userContext);
  const navigate = useNavigate();
  const [coinStatus, setCoinStatus] = useState(0);
  
  async function logout(){
    await fetch('http://127.0.0.1:8000/api/auth/logout/',{
      mode: "cors",
      credentials: "include"
    });
    await forceUpdate();
    navigate('/')
  }

  async function claim_coins(){
    var got_coins = await fetch('http://127.0.0.1:8000/api/coins/claim/',{
      mode: "cors",
      credentials: "include"
    }).then(response => response.json());
    if (got_coins.claimed == 'true'){
        setCoinStatus("claimed coins next available in 60 minutes");
    }
    else{
        setCoinStatus("already claimed next available in " + got_coins.available_in + " minutes");
    }
  }


  useEffect(() => {
    setCoinStatus("")
  }, []);

  const {game_key} = useParams();

  if (game_key)
    return <Outlet/>
  
  return(
    
    <div>
      <div className="bg-[#690d0d] h-screen items-center p-10">
          <div className="bg-[#961212] flex items-center justify-center flex-col rounded-3xl">
            <div className="my-4">
              <h1 className="text-3xl font-bold text-yellow-400">This is the main game screen please choose a game</h1>
              <p className="mt-2 text-xs text-yellow-200">
                coin amount: {userData.coins}
              </p>
            </div>
            <Button
              type="button"
              onClick={logout}
              className="w-44 mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
            >
              logout
            </Button>
            <Label htmlFor='coin_claim' className='mt-6 text-yellow-300'>
            claim free coins every hour
            </Label>
            <Button
              type="button"
              id="coin_claim"
              onClick={claim_coins}
              className="w-44 my-2 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
            >
              here
            </Button>
            <p className='text-sm text-yellow-200'>
              {coinStatus}
            </p>
          </div>
        </div>
        {/*<button onClick="location.href = '/games/wheel_of_fortune/';">Go to wheel of fortune</button>
        <button onClick="location.href = '/games/black_jack/lobby1';">Go to black jack</button>
        <button onClick="location.href = '/lobby2';">Try Lobby 2</button>
        <button onClick={logout}>logout</button>
        <button onClick={claim_coins}>claim free coins every hour!!!!</button>
        <p>{coinStatus}</p>*/}
    </div>
  )
}

