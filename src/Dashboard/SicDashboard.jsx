import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CriminalList from "../components/CriminalList";
import MapComponent from "../components/MapComponent";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";

const SicDashboard = () => {
  const [criminals, setCriminals] = useState([]);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch criminals from API
  useEffect(() => {
    const fetchCriminals = async () => {
      try {
        const response = await axiosInstance.get(endpoint.criminal.showall) // Replace with your real endpoint
        const data =  response.data;
        if (data.success && Array.isArray(data.data)) {
          setCriminals(data.data);
        } else {
          setCriminals([]); // Fallback
        }
      } catch (err) {
        console.error("Failed to load criminals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCriminals();
  }, []);

  return (
    <div className="w-full flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
      {/* Sidebar */}
      <Sidebar role="sic" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center flex-1 h-full">
            <span className="text-lg text-gray-600">Loading...</span>
          </div>
        ) : (
          <main className="flex-1 p-6 overflow-auto">
            {/* Header + Add Criminal Button */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Criminal Records</h2>
                <button
                  onClick={() => (window.location.href = "/sic/addcriminal")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition duration-200"
                >
                  Add New Criminal
                </button>
              </div>

              
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
  {/* Criminal List */}
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[500px]">
    <h3 className="text-xl font-semibold mb-4 text-gray-700 px-6 pt-6">Criminal List</h3>
    <div className="px-6 pb-6 flex-1 overflow-y-auto">
      <CriminalList onSelectCriminal={setSelectedCriminal} criminals={criminals} />
    </div>
  </div>

  {/* Map */}
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[500px]">
    <div className="px-6 pt-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-700">Criminal Location Map</h3>
      <p className="text-sm text-gray-500 mb-4">Click on a criminal to view their location.</p>
    </div>
    <div className="flex-1 rounded-b-xl overflow-hidden shadow-lg border-t border-gray-100">
      <MapComponent selectedCriminal={selectedCriminal} criminals={criminals} />
    </div>
  </div>
</section>
          </main>
        )}
      </div>
    </div>
  );
};

export default SicDashboard;