// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-l from-gray-900 via-gray-800 to-black text-white mt-12 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Criminal Records</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Wanted List</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Report Crime</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Info</h3>
            <p className="mb-2">Barrackpore Police Commissionerate</p>
            <p className="mb-2">North 24 Parganas, West Bengal</p>
            <p className="mb-2">📞 +91 12345 67890</p>
            <p>✉️ info@barrackporepolice.gov.in</p>
          </div>

          {/* Follow Us + Copyright */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-white hover:text-blue-500 transition"><span>📘 Facebook</span></a>
              <a href="#" className="text-white hover:text-blue-400 transition"><span>🐦 Twitter</span></a>
              <a href="#" className="text-white hover:text-red-500 transition"><span>📷 Instagram</span></a>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              &copy; {new Date().getFullYear()} Barrackpore Police Commissionerate. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;