import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer }from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export const userContext = createContext({})

export const UserContextProvider = ({children}) => {
  const [userData, setUserData] = useState({user: null, loading: true});
  const [update, setUpdate] = useState(0);

  async function forceUpdate() {
    setUserData({user: null, loading: true});
    setUpdate(update + 1);
  }

  useEffect(() => {
    console.log("loading the context provider")
    fetch('http://127.0.0.1:8000/api/auth/user', {
      mode: 'cors',
      credentials: 'include'
    }).then(res => {
      res.json().then(json => {
        setUserData({user: json.user, loading: false});
      })
    });
  }, [update]);

  return (
    <userContext.Provider value={{userData: userData, forceUpdate: forceUpdate}}>
      {children}
    </userContext.Provider> 
  )
}

export const PrivateRoute = ({}) => {
  const {userData} = useContext(userContext)
  console.log(userData)
  if (userData.loading) {
    return <div>loading...</div>
  }
  return userData.user ? <Outlet/> : <Navigate to="/login"/>
}

export const LoginPage = () => {
  return <div>login here</div>
}