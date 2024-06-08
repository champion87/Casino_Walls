import {
  React, 
  useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
 } from "react-router-dom";
import './App.css';

function App() {
  return(
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/games" Component={Games} /> 
          <Route path="/" Component={RootPage} /> 
        </Routes>
      </Router>
    </div>
  );
}


function RootPage(){
  const navigate = useNavigate();

  async function sign_as_guest(page_address){
    const res = await fetch('http://127.0.0.1:8000/create_guest_acount/', {
      mode: 'cors',
      credentials: 'include'
    });
    navigate(page_address);
  }

  async function form_action(action, page_address){
    let form = document.getElementById("form");
    const res = await fetch(action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form),),
        mode: 'cors',
        credentials: 'include'
    }).then(response => response.json());
    console.log(res.status);
    if (res.status === 'ok'){
      navigate(page_address);
    }
  }

  return (
    <div>
      <h1>Welcome to Casino walls</h1>
        <p>Here you can play games</p>
        <button onClick={() => sign_as_guest('/games/')}>Sign in as guest</button>
        
        <form id="form">
            <label htmlFor="username">username:</label><br/>
            <input type="text" id="username" name="username"/><br/>
            <label htmlFor="password">password:</label><br/>
            <input type="password" id="password" name="password" /><br/><br/>
            <input type="button" onClick={() => form_action('http://127.0.0.1:8000/create_acount/', '/games/')} value="create acount"/>
            <input type="button" onClick={() => form_action('http://127.0.0.1:8000/login/', '/games/')} value="login"/>
        </form>
    </div>
  );
}

function Games() {
  const navigate = useNavigate();

  async function display_coin_amount(){
    const coin_res = await fetch('http://127.0.0.1:8000/get_coin_amount/', {
      mode: "cors",
      credentials: "include"
    });
    let coin_amount = await coin_res.text();
    document.getElementById("coins").textContent = "coin amount: " + coin_amount.slice(1, -1);
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
        coin_status.textContent = "claimed coins next available in 60 minutes";
    }
    else{
        console.log(got_coins.available_in);
        coin_status.textContent = "already claimed next available in " + got_coins.available_in + " minutes";
    }
    display_coin_amount();
  }

  useEffect(() => {
    display_coin_amount();
  }, []);

  return(
    <div onLoad={display_coin_amount}>
      <h1>This is the main game screen please chose a game</h1>
        <p id="coins">coin count: </p>
        <button onClick="location.href = '/games/wheel_of_fortune/';">Go to wheel of fortune</button>
        <button onClick="location.href = '/games/black_jack/lobby1';">Go to black jack</button>
        <button onClick="location.href = '/lobby2';">Try Lobby 2</button>
        <button onClick={logout}>logout</button>
        <button onClick={claim_coins}>claim free coins every hour!!!!</button>
        <p id="coin_status"></p>
    </div>
  )
}

export default App;