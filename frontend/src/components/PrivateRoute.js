import React, {
  useState,
  useEffect,
  createContext,
  useContext}from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export const userContext = createContext({})

export const UserContextProvider = ({children}) => {
  const [userData, setUserData] = useState({user: null, loading: true});

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/auth/user', {
      mode: 'cors',
      credentials: 'include'
    }).then(res => {
      res.json().then(json => {
        setUserData({user: json.user, loading: false});
      })
    })
  }, []);

  return (
    <userContext.Provider value={userData}>
      {children}
    </userContext.Provider> 
  )
}

export const PrivateRoute = ({}) => {
  const {user, loading} = useContext(userContext)
  
  if (loading) {
    return <div>loading...</div>
  }
  return user ? <Outlet/> : <Navigate to="/login"/>
}

export const LoginPage = () => {
  return <div>login here</div>
}