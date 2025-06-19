import React, { useState } from "react";

const Header = () => {
  
  const [user] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
                <a href="/" className="text-sm font-medium text-gray-200 hover:text-indigo-500">
                  Home
                </a>
                <a href="/services" className="text-sm font-medium text-gray-900 hover:text-indigo-500">
                  Services
                </a>
                <a href="/wanted" className="text-sm font-medium text-gray-900 hover:text-indigo-500">
                  Wanted List
                </a>
                <a href="/contact" className="text-sm font-medium text-gray-900 hover:text-indigo-500">
                  Contact
                </a>
              </div>
            </nav>
          </div>

          <div className="flex items-center">
            {/* CTA / Login */}
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <a
                href="/login"
                className="text-sm font-medium bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Login
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 md:hidden"
            >
              <svg
                className="h-6 w-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
              Home
            </a>
            <a href="/services" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
              Services
            </a>
            <a href="/wanted" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
              Wanted List
            </a>
            <a href="/contact" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

// User Dropdown Component
const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="relative ml-6">
      
        <img
          src={"https://www.gravatar.com/avatar/" + user.email + "?d=mp"}
          alt="User Avatar"
          className="h-8 w-8 rounded-full outline-black cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <p className="px-4 py-2 text-sm text-gray-700 border-b">{user.fullName}</p>
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
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