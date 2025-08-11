import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login-registration' }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but role is not allowed, redirect based on user role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard-management" replace />;
      case 'venue_owner':
        return <Navigate to="/venue-details-booking" replace />;
      default:
        return <Navigate to="/homepage-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
