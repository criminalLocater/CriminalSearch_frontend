import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Make sure this is the updated one
import { FaBars } from "react-icons/fa";
import { SiPacker } from "react-icons/si";

const Header = () => {
    const [user] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Unified state for sidebar
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };
    return (
        <>
            {/* Main Header */}
            <header className="bg-white shadow sticky top-0 z-30  w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex items-center justify-between h-16 ">
                        <div className="flex items-center ">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="h-14 w-auto"
                                />
                                <span className="ml-2 text-lg  hidden custom:inline-block font-bold text-gray-900 whitespace-nowrap ">
                                    Barrackpore Police Commissionerate
                                </span>{" "}
                            </div>
                            {/* Desktop Nav */}
                            <nav className="hidden md:block ml-10">
                                <div className="flex space-x-8 lg:space-x-10">
                                    <a
                                        href="/"
                                        className="text-base lg:text-lg font-medium text-gray-900 hover:text-indigo-700 transition"
                                    >
                                        Home
                                    </a>
                                    <a
                                        href="/service"
                                        className="text-base lg:text-lg font-medium text-gray-900 hover:text-indigo-700 transition"
                                    >
                                        Services
                                    </a>
                                    <a
                                        href="/contact"
                                        className="text-base lg:text-lg font-medium text-gray-900 hover:text-indigo-700 transition"
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
                                onClick={() => setSidebarOpen(true)}
                                className="ml-4 md:hidden text-gray-900 focus:outline-none"
                                aria-label="Open menu"
                            >
                                <FaBars size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        {/* <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setSidebarOpen(false)}
                        ></div> */}

                        {/* Sidebar Content */}
                        {/* <aside className="relative z-50 w-64 sm:w-72 bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 shadow-xl h-full overflow-y-auto">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 text-white"
                                aria-label="Close menu"
                            >
                                ✕
                            </button> */}
                            <Sidebar role={user?.role} />
                        {/* </aside> */}
                    </div>
                )}
            </header>
        </>
    );
};

// User Dropdown Component
const UserDropdown = ({ user, handleLogout }) => {
    const User = JSON.parse(localStorage.getItem("user"));
    const id = User._id;
    const [open, setOpen] = useState(false);
    const dropdownref = useRef(null);
    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownref.current &&
                !dropdownref.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="settingsdropdown relative ml-4 md:ml-6"
            ref={dropdownref}
        >
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
                <div className="absolute -right-16 top-16 md:-right-0 w-52 bg-white rounded-md shadow-lg z-10 max-h-64 overflow-y-auto ">
                    <div className="py-1">
                        <p className="px-4 py-2 text-sm font-medium text-gray-700 border-b truncate">
                            Hello!{" "}
                            <span className="font-bold text-blue-600">
                                {user.fullName}
                            </span>
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
                                    : "/officer"
                            }
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Dashboard
                        </a>
                        <a
                            href={`/change-password/${id}`}
                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Change Password
                        </a>
                        <button
                            onClick={() => {
                                handleLogout();
                                window.location.reload();
                            }}
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
