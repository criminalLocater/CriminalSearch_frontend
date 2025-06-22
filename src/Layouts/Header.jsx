import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Make sure this is the updated one
import { FaBars } from "react-icons/fa";

const Header = () => {
    const [user] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // For drawer sidebar
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            {/* Main Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="h-10 w-auto"
                                />
                                <span className="ml-2 text-xl font-bold text-gray-900">
                                    Barrackpore Police Commissionerate
                                </span>
                            </div>

                            {/* Desktop Nav */}
                            <nav className="hidden md:block ml-10">
                                <div className="flex space-x-10">
                                    <a
                                        href="/"
                                        className="text-lg font-medium text-gray-900 hover:text-indigo-700"
                                    >
                                        Home
                                    </a>
                                    <a
                                        href="/services"
                                        className="text-lg font-medium text-gray-900 hover:text-indigo-700"
                                    >
                                        Services
                                    </a>
                                    <a
                                        href="/wanted"
                                        className="text-lg font-medium text-gray-900 hover:text-indigo-700"
                                    >
                                        Wanted List
                                    </a>
                                    <a
                                        href="/contact"
                                        className="text-lg font-medium text-gray-900 hover:text-indigo-700"
                                    >
                                        Contact
                                    </a>
                                </div>
                            </nav>
                        </div>

                        <div className="flex items-center">
                            {/* Desktop Login / User Dropdown */}
                            {!user ? (
                                <a
                                    href="/login"
                                    className="hidden md:block text-sm font-medium bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                                >
                                    Login
                                </a>
                            ) : (
                                <UserDropdown
                                    user={user}
                                    handleLogout={handleLogout}
                                />
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="ml-4 md:hidden text-gray-900 focus:outline-none"
                            >
                                <FaBars size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Below Header */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a
                                href="/"
                                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                            >
                                Home
                            </a>
                            <a
                                href="/service"
                                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                            >
                                Services
                            </a>
                            <a
                                href="/wanted"
                                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                            >
                                Wanted List
                            </a>
                            <a
                                href="/contact"
                                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                            >
                                Contact
                            </a>

                            {/* Conditional Login Button */}
                            {!user && (
                                <a
                                    href="/login"
                                    className="block px-3 py-2 text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 mt-2"
                                >
                                    Login
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Drawer Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    {/* Sidebar Content */}
                    <aside className="relative z-50 w-64 bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 shadow-xl h-full overflow-y-auto">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 text-white md:hidden"
                        >
                            ✕
                        </button>

                        <Sidebar role={user?.role} />
                    </aside>
                </div>
            )}
        </>
    );
};

// User Dropdown Component
const UserDropdown = ({ user, handleLogout }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative ml-6">
            {/* Profile Image or Placeholder */}
            {user.photo ? (
                <img
                    src={user.photo}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            ) : (
                <span
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    {user.fullName?.charAt(0).toUpperCase() || "U"}
                </span>
            )}

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <p className="px-4 py-2 text-sm font-medium text-gray-700 border-b truncate">
                            {user.fullName}
                        </p>
                        <a
                            href="/profile"
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </a>
                        <a
                            href={
                                user.role === "admin"
                                    ? "/admin"
                                    : user.role === "sic"
                                    ? "/sic"
                                    : "/user"
                            }
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Dashboard
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
