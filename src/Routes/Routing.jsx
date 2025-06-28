import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

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
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import ChangePassword from "../components/ChangePassword";

// Criminal-related pages
import CriminalPage from "../components/CriminalPage";
import AddCriminalPage from "../components/AddCriminal";
import EditCriminalPage from "../components/EditCriminal";
import ViewCriminal from "../components/ViewCriminal";
import CriminalList from "../components/CriminalList";

// Station-related pages
import StationListPage from "../components/StationList";
import ViewStation from "../components/ViewStation";
import EditStationPage from "../components/EditStation";
import ContactDashboard from "../components/ContactsDashboard";
import ViewContact from "../components/ViewContact";

// Lazy-loaded Dashboards
const AdminDashboard = React.lazy(() => import("../Dashboard/AdminDashboard"));
const SicDashboard = React.lazy(() => import("../Dashboard/SicDashboard"));
const OfficerDashboard = React.lazy(() => import("../Dashboard/OfficerDashboard"));

// Protected Profile Page
const Profile = React.lazy(() => import("../Auth/Profile"));

function Routing() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <div className="app flex flex-col w-full min-h-screen bg-gray-50 text-gray-800">
        <div className="flex w-full flex-col min-h-screen">
          <Header />
          <main className="w-full flex-1 main-wrapper">
            <ErrorBoundary>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/service" element={<Service />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/change-password/:userId" element={<ChangePassword />} />

                {/* Authenticated Users Only */}
                <Route
                  path="/profile"
                  element={
                    isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
                  }
                />

                {/* Officer Role: View-only access */}
                <Route
                  path="/criminal-list"
                  element={
                    ["officer", "sic", "admin"].includes(user?.role) ? (
                      <CriminalList />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/criminalpage"
                  element={
                    [ "sic"].includes(user?.role) ? (
                      <CriminalPage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/viewcriminal/:id"
                  element={
                    ["officer", "sic"].includes(user?.role) ? (
                      <ViewCriminal />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                {/* Admin can add police stations */}
                <Route
                  path="/addstation"
                  element={
                    user?.role === "admin" ? (
                      <Suspense fallback="Loading...">
                        <AddPoliceStation />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/view-station/:id"
                  element={
                    user?.role === "admin" ? (
                      <Suspense fallback="Loading...">
                        <ViewStation />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* SIC & Admin can add/edit/delete criminals */}
                <Route
                  path="/addcriminal"
                  element={
                    ["sic"].includes(user?.role) ? (
                      <AddCriminalPage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/editcriminal/:id"
                  element={
                    ["sic"].includes(user?.role) ? (
                      <EditCriminalPage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* Admin-only: Police Stations + User Management */}
                <Route
                  path="/admin/*"
                  element={
                    user?.role === "admin" ? (
                      <Suspense fallback="Loading...">
                        <AdminDashboard />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/admin/stations"
                  element={
                    user?.role === "admin" ? (
                      <StationListPage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/edit-station/:id"
                  element={
                    user?.role === "admin" ? (
                      <EditStationPage />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* SIC Dashboard - CRUD on Criminal Data */}
                <Route
                  path="/sic/*"
                  element={
                    [ "sic"].includes(user?.role) ? (
                      <Suspense fallback="Loading...">
                        <SicDashboard />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* Officer Dashboard - View Criminal Data */}
                <Route
                  path="/officer/*"
                  element={
                    ["officer"].includes(user?.role) ? (
                      <Suspense fallback="Loading...">
                        <OfficerDashboard />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                {/* Contact Dashboard for Admin */}
                <Route
                  path="/contactdashboard"
                  element={
                    ["admin"].includes(user?.role) ? (
                      <Suspense fallback="Loading...">
                        <ContactDashboard />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/admin/contact/viewcontact/:id"
                  element={
                    ["admin"].includes(user?.role) ? (
                      <Suspense fallback="Loading...">
                        <ViewContact />
                      </Suspense>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                {/* Redirect if no match */}
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