import React from "react";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";
//import UserTable from "../components/UserTable";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}

        {/* Scrollable Main Area */}
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Users", value: "12,432", color: "bg-blue-500" },
              { title: "Officers", value: "9,321", color: "bg-green-500" },
              { title: "Active Stations", value: "18", color: "bg-yellow-500" },
              { title: "Pending Actions", value: "7", color: "bg-red-500" },
            ].map((stat, index) => (
              <div key={index} className={`rounded-lg shadow-md text-white p-6 ${stat.color}`}>
                <h3 className="text-lg font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Management */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>
              {/* <UserTable /> */}
            </div>

            {/* Right Column - Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>

              <div className="space-y-4">
                <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200" onClick={() => window.location.replace("/register")}>
                  Add New Officer
                </button>
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200" onClick={() => window.location.replace("/addstation")}>
                  Register New Station
                </button>
                <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200">
                  View Reports
                </button>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Recent Activity</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Krishna Baditya added as Inspector</li>
                  <li>• Naihati PS updated its contact info</li>
                  <li>• 3 new officers registered today</li>
                  <li>• Fraud case #456 assigned to Officer Singh</li>
                </ul>
              </div>

              {/* System Status */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">System Status</h3>
                <div className="flex items-center justify-between text-sm">
                  <span>Database:</span>
                  <span className="text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>API:</span>
                  <span className="text-green-600">Live</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Users Online:</span>
                  <span className="text-yellow-600">12</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default AdminDashboard;