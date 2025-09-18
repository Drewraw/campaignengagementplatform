import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ currentUser }) => {
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
