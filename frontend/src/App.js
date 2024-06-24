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
import Lobby from './pages/lobby_gpt.js';
import { Wheel_of_fortune } from './pages/wheel_of_fortune';
import { BlackJackMainPage } from './pages/blackjack_main_page';
import { Toaster } from './components/ui/toaster';



const App = () => {

  return (
    <div className='App'>
      <Toaster />
      <UserContextProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            

            {/* TESTING */}
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/bjGPT" element={<BJ_GPT />} />
            <Route path="/blackjack" element={<BlackJackPage />} />
            {/* TESTING */}


            
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/blackjack_main" element={<BlackJackMainPage />} />
              <Route exact path="/games" element={<GamesLobbyPage />}>
                <Route path="/games/blackjack" element={<BlackJackPage />} />
                <Route path="/games/wheel_of_fortune" element={<Wheel_of_fortune />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </UserContextProvider>
    </div>
  );
}



export default App;