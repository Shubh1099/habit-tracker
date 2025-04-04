// client/src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the hook

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth(); // Get user and loading state from context
  const location = useLocation(); // Get current location

  if (isLoading) {
    // Show loading indicator while checking auth status from localStorage
    return <div className="text-center p-10">Checking authentication...</div>; // Or a spinner
  }

  if (!user) {
    // User not logged in, redirect to login page
    // Pass the current location to redirect back after login (optional)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the child route component (e.g., DashboardPage)
  return <Outlet />;
};

export default ProtectedRoute;
