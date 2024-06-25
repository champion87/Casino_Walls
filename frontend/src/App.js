import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import './App.css';
import { PrivateRoute, UserContextProvider } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage.js';
import { GamesLobbyPage } from './pages/games';
import { LoginPage } from './pages/Login.js';
import { BlackJackPage } from './pages/black_jack.jsx'
import BJ_GPT from './pages/bjgpt';
import Lobby from './pages/Lobby.js';
import { Wheel_of_fortune } from './pages/wheel_of_fortune';
import { BlackJackMainPage } from './pages/blackjack_main_page';



const App = () => {

  return (
    <div className='App'>
      <UserContextProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* TESTING */}
            <Route path="/lobby/:lobby_key" element={<Lobby />} />
            <Route path="/bjGPT/:game_key" element={<BJ_GPT />} />
            <Route path="/blackjack" element={<BlackJackPage />} />
            {/* TESTING */}

            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/blackjack_main" element={<BlackJackMainPage />} />
              <Route path="games/:game_key?" element={<GamesLobbyPage />}>
                <Route path="blackjack" element={<BlackJackPage />} />
                <Route path="bjGPT" element={<BJ_GPT/>} />
                <Route path="wheel_of_fortune" element={<Wheel_of_fortune />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </UserContextProvider>
    </div>
  );
}



export default App;