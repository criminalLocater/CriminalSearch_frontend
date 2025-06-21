import React from "react";
import Sidebar from "../components/Sidebar";
import CriminalList from "../components/CriminalList";

const OfficerDashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Sidebar */}
      <Sidebar role="officer" />

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Criminal Records Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Criminal Records</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200">
                🔍 Search Criminals
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-4 bg-indigo-50 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  View and search criminal records assigned to your station.
                </p>
              </div>
              <CriminalList isReadOnly={true} />
            </div>
          </section>

          {/* Quick Actions / Info Panel */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Assigned Cases</h3>
              <p className="text-3xl font-bold text-blue-600">17</p>
              <p className="text-sm text-gray-500 mt-2">New: 3 • In Progress: 10 • Closed: 4</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Last Reported Criminal</h3>
              <p className="text-lg font-medium text-gray-700">Amit Singh</p>
              <p className="text-sm text-gray-500 mt-1">Case #CR20250619 - Theft</p>
            </div>
          </section>
        </main>
      </div>
  );
};

export default OfficerDashboard;