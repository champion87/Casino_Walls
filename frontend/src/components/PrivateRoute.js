import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = ({isAuthenticated}) => {
  return(
    (isAuthenticated === "True") ? <Outlet/> : <Navigate to="/"/>
  )
}

export default PrivateRoute;