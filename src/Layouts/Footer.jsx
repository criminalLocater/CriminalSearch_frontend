import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-l from-gray-900 via-gray-800 to-black text-white mt-12 pt-10 pb-6 ">
      <div className="container sm:mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Criminal Records</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Wanted List</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Report Crime</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Info</h3>
            <p className="mb-2 text-sm sm:text-base">Barrackpore Police Commissionerate</p>
            <p className="mb-2 text-sm sm:text-base">North 24 Parganas, West Bengal</p>
            <p className="mb-2 text-sm sm:text-base">📞 +91 12345 67890</p>
            <p className="text-sm sm:text-base">✉️ info@barrackporepolice.gov.in</p>
          </div>

          {/* Follow Us + Copyright */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Follow Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-white hover:text-blue-500 transition" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="text-white hover:text-blue-400 transition" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" className="text-white hover:text-red-500 transition" aria-label="Instagram">
                  📷
                </a>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 mt-4">
              &copy; {new Date().getFullYear()} Barrackpore Police Commissionerate. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;