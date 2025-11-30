// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireVerification = true, userType = 'customer' }) => {
  const { user, loading, isVerified, userType: currentUserType } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to appropriate login page based on userType prop
    if (userType === 'admin') {
      return <Navigate to="/admin/login" replace />;
    } else if (userType === 'seller') {
      return <Navigate to="/seller/login" replace />;
    } else {
      return <Navigate to="/customer/login" replace />;
    }
  }

  // Check if the logged-in user's type matches the required route type
  // This prevents a customer from accessing seller routes and vice versa
  if (currentUserType !== userType) {
    // User is logged in but with wrong user type - redirect to appropriate login
    if (userType === 'admin') {
      return <Navigate to="/admin/login" replace />;
    } else if (userType === 'seller') {
      return <Navigate to="/seller/login" replace />;
    } else {
      return <Navigate to="/customer/login" replace />;
    }
  }

  // Check if verification is required and user is not verified
  // Admin users don't need verification check
  if (requireVerification && !isVerified && userType !== 'admin') {
    return <Navigate to="/pending-verification" replace />;
  }

  return children;
};

export default ProtectedRoute;