import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Optional: for hamburger icons

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true); // Default open on desktop
  const currentPath = window.location.pathname;

  const getLinks = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Manage Users", path: "/admin/users" },
          { name: "Manage Stations", path: "/admin/stations" },
          { name: "Profile", path: "/profile" },
        ];
      case "sic":
        return [
          { name: "Add Criminal", path: "/sic/addcriminal" },
          { name: "View Criminals", path: "/sic/criminalpage" },
          { name: "Profile", path: "/profile" },
        ];
      case "officer":
        return [
          { name: "Search Criminals", path: "/officer/criminals" },
          { name: "Profile", path: "/profile" },
        ];
      default:
        return [];
    }
  };

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } w-64 bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 shadow-xl h-full fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* Logo / Title */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white text-indigo-900 font-bold flex items-center justify-center mr-3 shadow-md">
              BP
            </div>
            <h2 className="text-2xl font-extrabold hidden md:block">Barrackpore</h2>
          </div>

          {/* Close Button (for mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {getLinks().map((link, index) => {
            const isActive = currentPath === link.path;

            return (
              <Link
                key={index}
                to={link.path}
                className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-indigo-900 shadow-md font-semibold"
                    : "hover:bg-indigo-700 hover:shadow hover:translate-x-1"
                }`}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)} // Auto-close on mobile after click
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <hr className="my-6 border-t border-gray-700" />

        {/* Role Badge */}
        <div className="mt-auto">
          <div className="px-4 py-2 bg-indigo-700 rounded-full text-center text-sm uppercase tracking-wider font-medium shadow-inner">
            Role:{" "}
            <span className="font-bold capitalize">
              {role || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;