import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // If no token or user → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided → check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Optional: Show unauthorized page or redirect
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // All good → render child route
  return <Outlet />;
};

export default ProtectedRoute;