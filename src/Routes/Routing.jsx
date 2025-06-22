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
import CriminalList from "../components/CriminalList";
import CriminalPage from "../components/CriminalPage";
import AddCriminalPage from "../components/AddCriminal";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
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
      <div className="app flex flex-col w-full min-h-screen bg-gray-50 text-gray-800 border-2 border-gray-950">
        <div className="flex w-full flex-col min-h-screen border-2 border-amber-100">
          <Header />
          <main className=" w-full flex main-wrapper border-2 border-red-400">
            <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/addstation" element={<AddPoliceStation />} />
              <Route path="/service" element={<Service />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/criminallist" element={<CriminalList />} />
              <Route path="/criminalpage" element={<CriminalPage />} />
              <Route path="/addcriminal" element={<AddCriminalPage />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

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

      </div>
    </Router>
  );
}

export default Routing;