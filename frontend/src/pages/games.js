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
      <h1>This is the main game screen please choose a game</h1>
      <p>coin amount: {userData.coins}</p>
        {/*<button onClick="location.href = '/games/wheel_of_fortune/';">Go to wheel of fortune</button>
        <button onClick="location.href = '/games/black_jack/lobby1';">Go to black jack</button>
        <button onClick="location.href = '/lobby2';">Try Lobby 2</button>*/}
        <button onClick={logout}>logout</button>
        <button onClick={claim_coins}>claim free coins every hour!!!!</button>
        <p>{coinStatus}</p>
    </div>
  )
}

