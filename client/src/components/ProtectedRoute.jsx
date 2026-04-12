import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — Gap Fix #1
 * Wraps any route that requires authentication.
 * Immediately redirects to /login if no JWT token is found in localStorage,
 * without waiting for a network request to fail.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
