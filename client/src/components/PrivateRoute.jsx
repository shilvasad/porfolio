import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check for the admin token in local storage
  const adminToken = localStorage.getItem('adminToken');

  // In a real app, you'd also want to verify the token's expiry
  // and validity with the backend, but for this project,
  // checking for existence is sufficient as per the prompt.
  return adminToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
