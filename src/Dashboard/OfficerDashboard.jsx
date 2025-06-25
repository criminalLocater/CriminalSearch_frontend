import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { Link } from "react-router-dom";
import Profile from "../Auth/Profile";

const OfficerDashboard = () => {
    const [criminals, setCriminals] = useState([]);
    const [filteredCriminals, setFilteredCriminals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isActiveTab, setIsActiveTab] = useState("criminalsrecords");
    function handleActiveTab(tab) {
        console.log(tab);
        setIsActiveTab(tab);
    }

    // Fetch all criminals from API
    useEffect(() => {
        const fetchCriminals = async () => {
            try {
                const response = await axiosInstance.get(
                    endpoint.criminal.showall
                );
                if (
                    response.data.success &&
                    Array.isArray(response.data.data)
                ) {
                    setCriminals(response.data.data);
                    setFilteredCriminals(response.data.data);
                }
            } catch (err) {
                setError("Failed to load criminal records.");
                console.error("Error fetching criminals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCriminals();
    }, []);

    // Handle search input change
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCriminals(criminals);
            return;
        }

        const query = searchQuery.toLowerCase();

        const filtered = criminals.filter(
            (criminal) =>
                criminal.name?.toLowerCase().includes(query) ||
                criminal.crimeType?.toLowerCase().includes(query)
        );

        setFilteredCriminals(filtered);
    }, [searchQuery, criminals]);

    return (
        <div className="w-full flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Sidebar */}
            <Sidebar
                role="officer"
                isActiveTab={isActiveTab}
                handleActiveTab={handleActiveTab}
            />

            {/* Scrollable Dashboard Content */}
            <main className="w-full flex-1 p-6 overflow-auto">
                <div className="">
                    {isActiveTab === "criminalsrecords" && (
                        <>
                            {/* Criminal Records Section */}
                            <section className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Criminal Records
                                    </h2>
                                    {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200 flex items-center gap-2">
                                        🔍 Search Criminals
                                    </button> */}
                                </div>

                                {/* Search Bar */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Search by name or crime type..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Table View */}
                                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                                    <div className="p-4 bg-indigo-50 border-b border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            View and search criminal records
                                            assigned to your station.
                                        </p>
                                    </div>

                                    {loading ? (
                                        <div className="p-6 text-center text-gray-500">
                                            Loading criminals...
                                        </div>
                                    ) : error ? (
                                        <div className="p-6 text-center text-red-500">
                                            {error}
                                        </div>
                                    ) : filteredCriminals.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">
                                            {searchQuery
                                                ? "No matching criminals found."
                                                : "No criminals available."}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Age
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Crime Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Location
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredCriminals.map(
                                                        (criminal) => (
                                                            <tr
                                                                key={
                                                                    criminal._id
                                                                }
                                                                className="hover:bg-gray-50 transition-colors"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {
                                                                        criminal.name
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {
                                                                        criminal.age
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {
                                                                        criminal.crimeType
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    <span
                                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                            criminal.status ===
                                                                            "Jail"
                                                                                ? "bg-red-100 text-red-800"
                                                                                : "bg-green-100 text-green-800"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            criminal.status
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {criminal.location?.coordinates?.join(
                                                                        ", "
                                                                    ) || "N/A"}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                                                                    <button>
                                                                        <Link
                                                                            to={`/viewcriminal/${criminal._id}`}
                                                                            className="text-blue-600 hover:text-blue-900"
                                                                        >
                                                                            View
                                                                        </Link>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Optional Quick Info Panel */}
                            {/* Uncomment this block if you'd like to use later */}
                            {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </section> */}
                        </>
                    )}
                    {isActiveTab === "profile" && (
                        <div>
                            <Profile />
                        </div>
                    )}{" "}
                </div>
            </main>
        </div>
    );
};

export default OfficerDashboard;
