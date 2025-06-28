import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import ConfirmModal from "./ConfirmModal";
import MapComponent from "../components/MapComponent";
import CriminalList from "../components/CriminalList";
import { Link } from "react-router-dom";

const CriminalPage = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [criminalToDeleteId, setCriminalToDeleteId] = useState(null);

  const fetchCriminals = async () => {
    try {
      const response = await axiosInstance.get(endpoint.criminal.showall);
      console.log("Fetched criminals:", response.data.data);
      
      setCriminals(response.data.data || []);
    } catch (err) {
      console.error("Error fetching criminals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriminals();
  }, []);

  const handleDelete = (id) => {
    setCriminalToDeleteId(id);
    setShowModal(true);
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Criminal Records</h1>
        {/* <Link
          to="/sic/addcriminal"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          + Add Criminal
        </Link> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Left Column - Criminal Table/List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table View */}
          {loading ? (
            <div className="animate-pulse flex justify-between space-x-4 p-4 bg-gray-200 h-24 rounded-lg"></div>
          ) : (
            <div className="overflow-hidden bg-white rounded-xl shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Crime Type
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {criminals.map((criminal) => (
                      <tr key={criminal._id} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                          {criminal.name}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                          {criminal.age}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                          {criminal.crimeType}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                          {criminal.location?.coordinates?.join(", ") || "N/A"}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              criminal.status === "Jail"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {criminal.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700 flex justify-end space-x-2">
                          <button>
                            <Link to={`/viewcriminal/${criminal._id}`} className="text-blue-600 hover:text-blue-900">
                              View
                            </Link>
                          </button>
                          <button
                            onClick={() => window.location.href = `/editcriminal/${criminal._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(criminal._id)}
                            className="text-red-600 hover:text-red-900"
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showModal && (
            <ConfirmModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onConfirm={async () => {
                try {
                  const id = criminalToDeleteId;
                  await axiosInstance.delete(endpoint.criminal.delete(id));
                  setCriminals(criminals.filter((c) => c._id !== id));
                  setShowModal(false);
                } catch (err) {
                  console.error("Failed to delete criminal", err);
                  setShowModal(false);
                }
              }}
              message="Are you sure you want to delete this criminal?"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CriminalPage;