import {React, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import styles from "../app/globals.css";
import casino from "../Images/casino.png"


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
      <main className="bg-[#690d0d] h-screen items-center p-10">
        <div className="grid w-full h-full grid-cols-2">
          <div className="bg-[#961212] flex items-center justify-center flex-col rounded-l-3xl">
            <div className="my-4">
              <h1 className="text-3xl font-bold text-yellow-400">Welcome to Casino Walls</h1>
              <p className="mt-2 text-xs text-slate-400">
              Please create an account or log in
              </p>
            </div>
            <form id="form">
              <Label htmlFor="username" className="text-yellow-400">Username</Label>
              <Input
                className="mt-2 mb-4 bg-transparent rounded-full"
                type="username"
                id="username"
                placeholder="Username"
              />
              <Label htmlFor="password" className="text-yellow-400">Password</Label>
              <Input
                className="mt-2 bg-transparent rounded-full"
                type="password"
                id="password"
                placeholder="Password"
              />

              <Button
                type="submit"
                className="w-full mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
              >
                Login
              </Button>
              <Button
              type="button"
              onClick={() => sign_as_guest('/')}
              className="w-full mt-6 bg-black text-yellow-300 rounded-full hover:text-yellow-200"
            >
              Sign in as guest
            </Button>
            </form>
            
            <p className="mt-4 text-xs text-slate-200">
              @2024 All rights reserved to arazim
            </p>
          </div>
            <img
              className="size-full object-bottom rounded-r-3xl"
              src={casino}
              alt="bg-image"
            />
        </div>
      </main>
      {/*<h1>Welcome to Casino walls</h1>
      <p>Please create an account or log in</p>
      <button onClick={() => sign_as_guest('/')}>Sign in as guest</button>

      <form>
        <label htmlFor="username">username:</label><br />
        <input type="text" id="username" name="username" /><br />
        <label htmlFor="password">password:</label><br />
        <input type="password" id="password" name="password" /><br /><br />
        <input type="button" onClick={() => form_action('http://127.0.0.1:8000/api/auth/create_acount/', '/')} value="create acount" />
        <input type="button" onClick={() => form_action('http://127.0.0.1:8000/api/auth/login/', '/')} value="login" />
      </form>*/}
    </div>
  );
}