import {
  React, 
  useEffect,
  useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
 } from "react-router-dom";
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import Games from './pages/games';

function App() {
  const [loggedIn, setLoggedIn] = useState(0);
  const didBlurSubscription = this.props.navigation.addListener(
    'willBlur',
    payload => {
      isLoggedIn();
    }
  );
  
  async function isLoggedIn()
  {
    var res = await fetch('http://127.0.0.1:8000/isLoggedIn/', {
      mode: 'cors',
      credentials: 'include'
    }).then(response => response.json());
    console.log(res.loggedIn);
    setLoggedIn(res.loggedIn);
  }

  useEffect(() => {
    console.log(loggedIn);
    isLoggedIn();
  }, []);

  if(loggedIn != "True" && loggedIn != "False")
    return null;

  return(
    <div className='App'>
      <Router>
        <Routes>
          <Route element={<PrivateRoute isAuthenticated={loggedIn} />}>
            <Route path="/games" Component={Games} exact/> 
          </Route>
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



export default App;