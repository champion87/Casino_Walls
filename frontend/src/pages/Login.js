import {React, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import { userContext } from "../components/PrivateRoute"


export const LoginPage = () => {
  const navigate = useNavigate();
  const {userData, forceUpdate} = useContext(userContext);


  async function sign_as_guest(page_address) {
    const res = await fetch('http://127.0.0.1:8000/api/auth/create_guest_acount/', {
      mode: 'cors',
      credentials: 'include'
    });
    await forceUpdate();
    console.log("going to log in")
    navigate('/');
  }

  async function form_action(action, page_address) {
    let form = document.getElementById("form");
    const res = await fetch(action, {
      method: 'POST',
      body: new URLSearchParams(new FormData(form),),
      mode: 'cors',
      credentials: 'include'
    }).then(response => response.json());
    console.log(res.status);
    if (res.status === 'ok') {
      navigate(page_address);
    }
  }

  return (
    <div>
      <h1>Welcome to Casino walls</h1>
      <p>Please create an account or log in</p>
      <button onClick={() => sign_as_guest('/')}>Sign in as guest</button>

      <form id="form">
        <label htmlFor="username">username:</label><br />
        <input type="text" id="username" name="username" /><br />
        <label htmlFor="password">password:</label><br />
        <input type="password" id="password" name="password" /><br /><br />
        <input type="button" onClick={() => form_action('http://127.0.0.1:8000/api/auth/create_acount/', '/')} value="create acount" />
        <input type="button" onClick={() => form_action('http://127.0.0.1:8000/api/auth/login/', '/')} value="login" />
      </form>
    </div>
  );
}