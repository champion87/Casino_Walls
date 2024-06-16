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
import {PrivateRoute, UserContextProvider} from './components/PrivateRoute';
import {HomePage} from './pages/HomePage.js';
import {GamesLobbyPage} from './pages/games';
import {LoginPage} from './pages/Login.js';
import { BlackJackPage } from './pages/black_jack.jsx'
import BJ_GPT from './pages/bjgpt';
import Lobby from './pages/lobby_gpt.js';



const App = () => {

  return (
  <div className='App'>
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />

          <Route path="/lobby" element={<Lobby/>} />
          <Route path="/blackjack" element={<BJ_GPT/>} />

          <Route element={<PrivateRoute />}>
            <Route exact path="/" element={<HomePage/>}  />
            <Route path="games/:game_key?" element={<GamesLobbyPage/>}>
              <Route path="blackjack" element={<BlackJackPage/>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  </div>
  );
}



export default App;