import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { Link } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

const CriminalPage = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [criminalToDeleteId, setCriminalToDeleteId] = useState(null);

  const fetchCriminals = async () => {
    try {
      const response = await axiosInstance.get(endpoint.criminal.showall);
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

  // ✅ Define handleDelete function
  const handleDelete = (id) => {
    setCriminalToDeleteId(id);
    setShowModal(true);
  };

  return (
    <>
      <div className="w-full p-6 bg-gray-100 min-h-screen border-1 border-teal-500">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Criminal Records</h1>
          <Link
            to="/addcriminal"
            className="criminal-link px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            + Add Criminal
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex space-x-4 w-full max-w-4xl">
              <div className="rounded-md bg-gray-300 h-10 w-1/4"></div>
              <div className="rounded-md bg-gray-300 h-10 w-1/4"></div>
              <div className="rounded-md bg-gray-300 h-10 w-1/4"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
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
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criminals.length > 0 ? (
                    criminals.map((criminal) => (
                      <tr
                        key={criminal._id}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
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
                        <td className="py-4 px-6 flex justify-center items-center whitespace-nowrap text-sm text-gray-700 space-x-2">
                          <Link
                            to={`/editcriminal/${criminal._id}`}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(criminal._id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                        No criminals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          try {
            const id = criminalToDeleteId;
            await axiosInstance.delete(endpoint.criminal.delete(id));
            setCriminals(
              criminals.filter((criminal) => criminal._id !== id)
            );
            setShowModal(false);
            // alert("Criminal deleted successfully.");
          } catch (err) {
            console.error("Error deleting criminal:", err);
            // alert("Failed to delete criminal.");
            setShowModal(false);
          }
        }}
        message="Are you sure you want to delete this criminal?"
      />
    </>
  );
};

export default CriminalPage;