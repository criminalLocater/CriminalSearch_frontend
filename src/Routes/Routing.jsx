import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Public Pages
import Home from "../components/Home";
import Service from "../components/Service";
import Contact from "../components/Contact";
import Footer from "../Layouts/Footer";
import Header from "../Layouts/Header";
import Register from "../Auth/Register";
import AddPoliceStation from "../components/AddStation";
import Login from "../Auth/Login";
import ErrorBoundary from "../components/ErrorBoundary";

// Lazy-loaded Dashboards
const AdminDashboard = React.lazy(() => import("../Dashboard/AdminDashboard"));
const SicDashboard = React.lazy(() => import("../Dashboard/SicDashboard"));
const OfficerDashboard = React.lazy(() => import("../Dashboard/OfficerDashboard"));

// Protected Profile Page
const Profile = React.lazy(() => import("../Auth/Profile"));

function Routing() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addstation" element={<AddPoliceStation />} />
            <Route path="/service" element={<Service />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Routes */}
            <Route
              path="/admin/*"
              element={
                user?.role === "admin" ? (
                  <React.Suspense fallback="Loading...">
                    <AdminDashboard />
                  </React.Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/sic/*"
              element={
                ["admin", "sic"].includes(user?.role) ? (
                  <React.Suspense fallback="Loading...">
                    <SicDashboard />
                  </React.Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/officer/*"
              element={
                ["officer", "sic", "admin"].includes(user?.role) ? (
                  <React.Suspense fallback="Loading...">
                    <OfficerDashboard />
                  </React.Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/profile"
              element={
                ["officer", "sic", "admin"].includes(user?.role) ? (
                  <React.Suspense fallback="Loading...">
                    <Profile />
                  </React.Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default Routing;