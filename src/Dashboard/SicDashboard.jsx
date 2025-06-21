import React from "react";
import Sidebar from "../components/Sidebar";

import CriminalList from "../components/CriminalList";
import MapComponent from "../components/MapComponent";

const SicDashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
      {/* Sidebar */}
      <Sidebar role="sic" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Criminal Records Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Criminal Records</h2>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition duration-200">
                Add New Criminal
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <CriminalList />
            </div>
          </section>

          {/* Map Section */}
          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Criminal Location Map</h3>
            <p className="text-sm text-gray-500 mb-4">View criminal locations on an interactive map.</p>
            <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg border border-gray-300 bg-gray-200">
              <MapComponent />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SicDashboard;