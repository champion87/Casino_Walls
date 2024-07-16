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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';



export const GamesLobbyPage = () => {
  const { userData, forceUpdate } = useContext(userContext);
  const navigate = useNavigate();
  const [coinStatus, setCoinStatus] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);

  async function get_coins() {
    const coin_res = await call_api("/api/coins", "GET").then(response => response.json());
    setCoinAmount(parseInt(coin_res.coins));
  }

  async function logout() {
    call_api("/api/auth/logout", "post");
    await forceUpdate();
    navigate('/')
  }

  async function claim_coins() {

    var got_coins = await call_api('/api/coins/claim', "POST").then(response => response.json());
    console.log(got_coins)
    if (got_coins.claimed == 'true') {
      setCoinAmount(coinAmount + 50)
      setCoinStatus("claimed coins next available in 60 minutes");
    }
    else {
      setCoinStatus("already claimed next available in " + got_coins.available_in + " minutes");
    }
  }


  useEffect(() => {
    setCoinStatus("")
    get_coins();
  }, []);

  const { game_key } = useParams();

  if (game_key)
    return <Outlet />

  return (

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
              Here
            </Button>
          </div>
          <p className='text-sm my-5 text-yellow-200'>
            {coinStatus}
          </p>
          <div className="grid w-full h-full grid-cols-3">
            <Card className="flex flex-col relative items-center m-10 bg-cards bg-cover">
              <CardHeader>
                <CardTitle className="text-yellow-400 font-bold">Blackjack</CardTitle>
                <CardDescription className="text-yellow-300">one of the all time best casino games</CardDescription>
              </CardHeader>
              <CardContent className="text-yellow-300 font-semibold">
              </CardContent>
              <CardFooter className="flex items-center justify-center absolute bottom-0">
                <Button className="text-yellow-400" onClick={() => navigate("/blackjack_main")}>Take Me There</Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col relative items-center m-10 bg-wheel">
              <CardHeader>
                <CardTitle className="text-yellow-400">Wheel of Fortune</CardTitle>
                <CardDescription className="text-yellow-300">one of the all time best casino games</CardDescription>
              </CardHeader>
              <CardContent>
              </CardContent>
              <CardFooter className="flex items-center justify-center absolute bottom-0">
                <Button className="text-yellow-300" onClick={() => navigate("/games/7/wheel_of_fortune")}>Take Me There</Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col m-10 bg-poker relative bg-cover bg-center items-center text-yellow-300">
              <CardHeader>
                <CardTitle>Poker</CardTitle>
                <CardDescription className="text-yellow-300">certainly the all time best casino game</CardDescription>
              </CardHeader>
              <CardContent>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </CardContent>
              <CardFooter className="flex items-center justify-center absolute bottom-0">
                <Button onClick={() => navigate("/poker_main")} className="text-yellow-300">Take Me There</Button>
              </CardFooter>
            </Card>
          </div>
          <div className=''>
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full m-4 bg-white inline-block text-black rounded-full hover:text-yellow-300"
            >
              Home Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

