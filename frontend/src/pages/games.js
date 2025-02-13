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
import { call_api } from 'src/lib/utils';



export const GamesLobbyPage = () =>  {
  const {userData, forceUpdate} = useContext(userContext);
  const navigate = useNavigate();
  const [coinStatus, setCoinStatus] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);

  async function get_coins(){
    const coin_res = await call_api("/api/coins", "GET").then(response => response.json());
    setCoinAmount(parseInt(coin_res.coins));
  }
  
  async function logout(){
    call_api("/api/auth/logout", "post");
    await forceUpdate();
    navigate('/')
  }

  async function claim_coins(){
    
    var got_coins = await call_api('/api/coins/claim', "POST").then(response => response.json());
    console.log(got_coins)
    if (got_coins.claimed == 'true'){
      setCoinAmount(coinAmount + 50)
      setCoinStatus("claimed coins next available in 60 minutes");
    }
    else{
      setCoinStatus("already claimed next available in " + got_coins.available_in + " minutes");
    }
  }


  useEffect(() => {
    setCoinStatus("")
    get_coins();
  }, []);

  const {game_key} = useParams();

  if (game_key)
    return <Outlet/>
  
  return(
    
    <div>
      <div className="bg-wall bg-cover h-screen w-screen items-center p-10">
          <div className="bg-black flex items-center justify-center flex-col rounded-3xl">
            <div className="my-4">
              <h1 className="text-3xl font-bold text-yellow-400">This is the main game screen please choose a game</h1>
              <p className="mt-2 text-yellow-200">
                coin amount: {coinAmount}
              </p>
            </div>
            <div className='items-center justify-center flex flex-col'>
            <Button
              type="button"
              onClick={logout}
              className="w-full bg-white text-black rounded-full hover:text-yellow-300"
            >
              logout
            </Button>
            <Label className='mt-6 text-yellow-300'>
            claim free coins every hour
            </Label>
            <Button
              type="button"
              id="coin_claim"
              onClick={claim_coins}
              className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
            >
              here
            </Button>
            </div>
            <p className='text-sm my-5 text-yellow-200'>
              {coinStatus}
            </p>
            <div className='flex '>
            <Button
              type="button"
              onClick={() => navigate("/games/7/wheel_of_fortune")}
              className="w-full m-4 inline-block bg-white text-black rounded-full hover:text-yellow-300"
            >
              wheel of fortune
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/blackjack_main")}
              className="w-full m-4 bg-white inline-block text-black rounded-full hover:text-yellow-300"
            >
              blackjack 
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/poker_main")}
              className="w-full m-4 bg-white inline-block text-black rounded-full hover:text-yellow-300"
            >
              poker 
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full m-4 bg-white inline-block text-black rounded-full hover:text-yellow-300"
            >
              home page
            </Button>
            </div>
          </div>
        </div>
    </div>
  )
}

