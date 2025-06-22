// src/pages/CriminalPage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { Link } from "react-router-dom";

const CriminalPage = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCriminals = async () => {
    try {
      const response = await axiosInstance.get(endpoint.criminal.showall);
      console.log(response.data);
      
      setCriminals(response.data);
    } catch (err) {
      console.error("Error fetching criminals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriminals();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Criminal Records</h1>
        <Link to="/addcriminal"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          + Add Criminal
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Age</th>
                <th className="py-3 px-4 border-b">Crime Type</th>
                <th className="py-3 px-4 border-b">Location</th>
                <th className="py-3 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {criminals.length > 0 ? (
                criminals.map((criminal) => (
                  <tr key={criminal._id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">{criminal.name}</td>
                    <td className="py-3 px-4 border-b">{criminal.age}</td>
                    <td className="py-3 px-4 border-b">{criminal.crimeType}</td>
                    <td className="py-3 px-4 border-b">
                      {criminal.location?.coordinates.join(", ") || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">{criminal.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No criminals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CriminalPage;