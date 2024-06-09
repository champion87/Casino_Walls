import {
    React, 
    useEffect,
    useState} from 'react';
  import {
    useNavigate,
   } from "react-router-dom";
  import '../App.css';


function Games() {
    const navigate = useNavigate();
    const [coins, setCoins] = useState(0);
    const [coinStatus, setCoinStatus] = useState(0);
  
    async function get_coin_amount(){
      const coin_res = await fetch('http://127.0.0.1:8000/get_coin_amount/', {
        mode: "cors",
        credentials: "include"
      });
      let coin_amount = await coin_res.text();
      setCoins(parseInt(coin_amount.slice(1,-1)));
    }
    
    async function logout(){
      await fetch('http://127.0.0.1:8000/logout/',{
        mode: "cors",
        credentials: "include"
      });
      navigate('/')
    }
  
    async function claim_coins(){
      var coin_status = document.getElementById("coin_status");
      var got_coins = await fetch('http://127.0.0.1:8000/games/claim_coins/',{
        mode: "cors",
        credentials: "include"
      }).then(response => response.json());
      if (got_coins.claimed == 'true'){
          setCoinStatus("claimed coins next available in 60 minutes");
          setCoins(coins + 50);
      }
      else{
          setCoinStatus("already claimed next available in " + got_coins.available_in + " minutes");
      }
    }
  
  
    useEffect(() => {
      get_coin_amount();
      setCoinStatus("")
    }, []);
  
    return(
      <div>
        <h1>This is the main game screen please choose a game</h1>
          <p id="coins">coin amount: {coins}</p>
          {/*<button onClick="location.href = '/games/wheel_of_fortune/';">Go to wheel of fortune</button>
          <button onClick="location.href = '/games/black_jack/lobby1';">Go to black jack</button>
          <button onClick="location.href = '/lobby2';">Try Lobby 2</button>*/}
          <button onClick={logout}>logout</button>
          <button onClick={claim_coins}>claim free coins every hour!!!!</button>
          <p id="coin_status">{coinStatus}</p>
      </div>
    )
  }

export default Games;