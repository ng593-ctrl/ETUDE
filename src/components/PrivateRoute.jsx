// study-sync/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    // Destructure currentUser and the loading state from the Auth Context
    const { currentUser, loading } = useAuth();

    // 1. Handle Loading State
    if (loading) {
        // Show a basic loading indicator while Firebase checks auth status
        return <div className="text-center p-10 text-white">Checking user status...</div>;
    }

    // 2. Handle Authentication
    // If currentUser object exists (user is logged in), render the nested route via Outlet
    if (currentUser) {
        return <Outlet />; 
    }

    // 3. Handle Unauthenticated
    // 🛑 CRITICAL FIX: Add the 'replace' prop here. This replaces the current bad history entry 
    // with the /login path, preventing the forward/back loop.
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;