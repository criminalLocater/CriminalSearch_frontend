import React, { useState, useEffect } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const StationListPage = () => {
    const [stations, setStations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stationToDelete, setStationToDelete] = useState(null);

    const navigate = useNavigate();

    // Fetch all police stations with pagination
    const fetchStations = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(endpoint.station.showall, {
                params: { page, limit }
            });

            if (res.data?.data) {
                setStations(res.data.data.users || []);
                setTotalPages(res.data.data.totalPages || 1);
            }
        } catch (err) {
            console.error("Failed to load stations:", err);
            setError("Failed to load police stations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
    }, [page, limit]);

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter stations based on search term
    const filteredStations = stations.filter(
        (station) =>
            station.stationName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            station.contactNumber
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // Handle delete action
    const handleDeleteClick = (id) => {
        const station = stations.find((s) => s.id === id);
        setStationToDelete(station);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!stationToDelete) return;

        const toastId = toast.loading("Deleting station...");
        try {
            await axiosInstance.delete(endpoint.station.delete(stationToDelete.id));
            setStations(stations.filter((s) => s.id !== stationToDelete.id));
            toast.success("Station deleted successfully!", { id: toastId });
        } catch (err) {
            console.error("Error deleting station:", err);
            toast.error("Failed to delete station.", { id: toastId });
        } finally {
            setIsModalOpen(false);
            setStationToDelete(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Police Stations</h2>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by station name or contact number..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Table View */}
            {loading ? (
                <p>Loading stations...</p>
            ) : filteredStations.length === 0 ? (
                <p className="text-gray-500 italic">No stations found.</p>
            ) : (
                <>
                    <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Station Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact Number
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStations.map((station) => (
                                        <tr key={station.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {station.stationName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {station.contactNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {station.location?.coordinates
                                                    ? `${station.location.coordinates[1]}, ${station.location.coordinates[0]}`
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                                                <button>
                                                    <Link
                                                        to={`/view-station/${station.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </Link>
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/edit-station/${station.id}`)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(station.id)}
                                                    className="text-red-600 hover:text-red-900"
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

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        {/* <div>
                            <label htmlFor="pageSize" className="text-sm text-gray-600 mr-2">
                                Show:
                            </label>
                            <select
                                id="pageSize"
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div> */}

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded ${
                                    page === 1
                                        ? "bg-gray-200 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                Previous
                            </button>

                            <span className="px-2 py-1 border rounded">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className={`px-3 py-1 rounded ${
                                    page === totalPages
                                        ? "bg-gray-200 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete "${stationToDelete?.stationName}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default StationListPage;