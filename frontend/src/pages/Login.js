import {React, useContext, useState, useEffect} from 'react';
import {useNavigate } from "react-router-dom";
import { userContext } from "../components/PrivateRoute"
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import styles from "../app/globals.css";
import casino from "../Images/casino.png"
import { LogIn } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { ToastAction } from '../components/ui/toast';
import { call_api } from 'src/lib/utils';

export const LoginPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(document.location.search)
  const {userData, forceUpdate} = useContext(userContext);
  const [pageState, setPageState] = useState('Login');
  var nextPageState


  async function sign_as_guest(page_address) {
    console.log(page_address);
    // const res = await fetch('http://127.0.0.1:8000/api/auth/create_guest_acount/', {
    //   mode: 'cors',
    //   credentials: 'include'
    // });
    const res = await call_api("/api/auth/create_guest_acount/", "post")
    await forceUpdate();
    console.log("going to log in")
    if (page_address)
      navigate(page_address);
    else
      navigate('/')
  }

  useEffect(() => {
    setPageState("Login")
    nextPageState = "Sign up"
  }, []);

  async function form_action(action, page_address) {
    let form = document.getElementById("form");
    const formData = new FormData(form);
    console.log(Array.from(formData.entries()));
    const res = await fetch(action, {
      method: 'POST',
      body: new URLSearchParams(formData),
      mode: 'cors',
      credentials: 'include'
    }).then(response => response.json());
    console.log(res.status);
    if (res.status === 'username_taken'){
      toast({
        title: "Username already taken",
        description: "Please pick another username",
        className: "bg-black text-yellow-400", 
        action: (
          <ToastAction altText="Ok">Ok</ToastAction>
        ),
      });
    }
    if (res.status === 'ok') {
      await forceUpdate();
      page_address ? navigate(page_address) : navigate('/');
    }
    if (res.status === 'not ok'){
      toast({
        title: "wrong credentials",
        description: "Incorrect username or password",
        className: "bg-black text-yellow-400", 
        action: (
          <ToastAction altText="Ok">Ok</ToastAction>
        ),
      });
    }
  }

  return (  
    <div>
      <div className="bg-wall2 h-screen bg-cover items-center p-10">
        <div className="grid w-full h-full grid-cols-2">
          <div className="bg-black flex items-center justify-center flex-col rounded-l-3xl">
            <div className="my-4">
              <h1 className="text-3xl font-bold text-yellow-400">Welcome to Casino Walls</h1>
              <p className="mt-2 text-xs text-slate-400">
              Please create an account or log in
              </p>
            </div>
            <form id="form">
              <Label htmlFor="username" className="text-yellow-400">Username</Label>
              <Input
                className="mt-2 mb-4 bg-transparent rounded-full text-white"
                type="username"
                id="username"
                name="username"
                placeholder="Username"
              />
              <Label htmlFor="password" className="text-yellow-400">Password</Label>
              <Input
                className="mt-2 bg-transparent rounded-full text-white"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />

              <Button
                type="button"
                className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
                onClick={() => form_action('http://127.0.0.1:8000/api/auth/' + ((pageState === "Login") ? "login" : "create_account") + "/", searchParams.get('prevPath'))}
              >
                {pageState}
              </Button>
              <div className='flex flex-row items-center justify-center'>
                <p className="text-xs text-slate-200">
                {(pageState === "Login") ? "don't " : "already "} have an account  
                </p>
                <Button
                  type="button"
                  onClick={() => { (pageState === "Login") ? setPageState("Sign up") : setPageState("Login")}}
                  className="text-xs p-1 text-yellow-300 hover:text-yellow-200 size-fit inline-block"
                  variant="link"
                >
                  {(pageState === "Login") ? "sign up" : "Login"}
                </Button> 
              </div>
              <Button
              type="button"
              onClick={() => sign_as_guest(searchParams.get('prevPath'))}
              className="w-full mt-6 bg-white text-black rounded-full hover:text-yellow-300"
            >
              Sign in as guest
            </Button>
            </form>
            <p className="mt-4 text-xs text-yellow-400">
            </p>
            <p className="mt-4 text-xs text-yellow-400">
              @2024 All rights reserved to arazim
            </p>
          </div>
            <img
              className="size-full object-bottom rounded-r-3xl"
              src={casino}
              alt="bg-image"
            />
        </div>
      </div>
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