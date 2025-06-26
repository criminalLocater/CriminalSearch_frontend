import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { endpoint } from "../Api/Api";
import MapComponent from "./MapComponent";

export default function ViewStation() {
    const [station, setStation] = useState(null);
    const [allStations, setAllStations] = useState([]);
    const [policeList, setPoliceList] = useState([]);

    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStation = async () => {
            try {
                const res = await axiosInstance.get(endpoint.station.edit(id));
                const stationsRes = await axiosInstance.get(
                    endpoint.station.showall
                );

                if (res.data && stationsRes.data) {
                    setStation(res.data.data || {});
                    setAllStations(stationsRes.data.data || []);

                    // ✅ Extract policeList directly from response
                    const currentStation = stationsRes.data.data.find(
                        (s) => s.id === id
                    );

                    if (currentStation?.policeList?.length > 0) {
                        setPoliceList(currentStation.policeList); // Set police list
                    } else {
                        setPoliceList([]); // No officers found
                    }
                }
            } catch (err) {
                console.error("Error fetching station:", err);
                setStation(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStation();
    }, [id]);
    if (loading) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">Loading station data...</p>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500 mb-4">Station not found</p>
                <button
                    onClick={() => navigate("/stations")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    ← Back to List
                </button>
            </div>
        );
    }

    const {
        stationName,
        contactNumber,
        location,
        isActive,
    } = station;

    return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {stationName}
        </h2>

        {/* Grid Layout for Station Info + Map */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            {/* Station Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">
                            Contact Number
                        </label>
                        <p className="font-semibold text-gray-800">
                            {contactNumber || "N/A"}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500">
                            Location
                        </label>
                        <p className="font-semibold text-gray-800">
                            {location?.coordinates?.join(", ") || "N/A"}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500">
                            Status: <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </span>
                        </label>
                        
                    </div>
                </div>
            </div>
        </div>
        {/* Station Map */}
            {location?.coordinates?.length === 2 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Station Location
                    </h3>
                    <MapComponent
                        selectedCriminal={{
                            _id: station._id,
                            name: station.stationName,
                            location: station.location,
                            crimeType: "Police Station",
                            status: isActive ? "Active" : "Inactive",
                        }}
                        criminals={allStations.map((s) => ({
                            _id: s._id,
                            name: s.stationName,
                            location: s.location,
                            crimeType: "Police Station",
                            status: s.isActive ? "Active" : "Inactive",
                        }))}
                    />
                </div>
            )}
        

        {/* Police Officers Table */}

        <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Assigned Police Officers
            </h3>

            {policeList.length === 0 ? (
                <p className="text-gray-500 italic">
                    No officers assigned to this station.
                </p>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Designation
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {policeList.map((officer, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {officer.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {officer.role?.toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {officer.rank}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {officer.designation || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                            {officer.email}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4">
            <button
                onClick={() => navigate("/stations")}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200"
            >
                ← Back to List
            </button>
        </div>
    </div>
);
}
