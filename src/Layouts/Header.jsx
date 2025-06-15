// src/components/Header.jsx
import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          {/* Custom SVG Logo */}
          <div className="w-20 h-20 bg-cover bg-center rounded-full shadow-md" style={{ backgroundImage: 'url("/logo.png")' }}>
            {/* Fallback text if SVG is not loaded */}
            <span className="sr-only">Barrackpore Police Commissionerate</span>
          </div>

          {/* Small Title */}
          <h3 className="text-base sm:text-lg font-semibold tracking-wide">
            Barrackpore Police Commissionerate
          </h3>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-5 text-sm font-medium">
          <a href="#" className="hover:text-yellow-300 transition duration-200">Home</a>
          <a href="#" className="hover:text-yellow-300 transition duration-200">Criminal Search</a>
          <a href="#" className="hover:text-yellow-300 transition duration-200">Wanted List</a>
          <a href="#" className="hover:text-yellow-300 transition duration-200">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;