import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { Link } from "react-router-dom";
import Profile from "../Auth/Profile";
import { FaBars } from "react-icons/fa";
import SidebarDashboard from "./SidebarDashboard";

const OfficerDashboard = () => {
    const [criminals, setCriminals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [isActiveTab, setIsActiveTab] = useState("criminalsrecords");
    const [sidebarOpen, setSidebarOpen] = useState(false); // Unified state for sidebar

    function handleActiveTab(tab) {
        setIsActiveTab(tab);
    }

    // Fetch paginated criminals
    const fetchCriminals = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                endpoint.criminal.showall,
                {
                    params: { page, limit },
                }
            );

            if (response.data?.data) {
                setCriminals(response.data.data.users || []);
                setTotalPages(response.data.data.totalPages || 1);
            }
        } catch (err) {
            setError("Failed to load criminal records.");
            console.error("Error fetching criminals:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCriminals();
    }, [page, limit]);

    // Handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter locally based on search query
    const filteredCriminals = criminals.filter(
        (criminal) =>
            criminal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            criminal.crimeType
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );
    const officerTabs = [
        { name: "Criminals Records", tab: "criminalsrecords" },
        { name: "Profile", tab: "profile" },
    ];

    return (
        <div className="w-full flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
            {/* Sidebar
      <Sidebar
        role="officer"
        isActiveTab={isActiveTab}
        handleActiveTab={handleActiveTab}
      /> */}
            {/* Sidebar */}
            {sidebarOpen && (
                <SidebarDashboard
                    role="officer"
                    isActiveTab={isActiveTab}
                    handleActiveTab={handleActiveTab}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {/* Sidebar */}
            <aside
                className={` hidden md:flex  inset-y-0 left-0  w-64 bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out  md:translate-x-0  md:flex-col md:h-full`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo / Title */}
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white text-indigo-900 font-bold flex items-center justify-center mr-3 shadow-md">
                                BP
                            </div>
                            <h2 className="text-2xl font-extrabold hidden md:block">
                                Barrackpore
                            </h2>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2 flex-1">
                        {officerTabs.map((link, index) => {
                            const isActive = isActiveTab === link.tab;

                            return (
                                <Link
                                    key={index}
                                    to={link.path || "#"}
                                    className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-indigo-900 shadow-md font-semibold"
                                            : "hover:bg-indigo-700 hover:shadow hover:translate-x-1"
                                    }`}
                                    onClick={(e) => {
                                        if (window.innerWidth < 768) {
                                            setSidebarOpen(false); // Close mobile sidebar
                                        }

                                        if (link.tab) {
                                            e.preventDefault(); // Prevent default for tab-based nav
                                            handleActiveTab(link.tab);
                                        }
                                        // If path exists, let <Link> handle routing
                                    }}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <hr className="my-6 border-t border-gray-700" />

                    {/* Role Badge */}
                    <div className="mt-auto">
                        <div className="px-4 py-2 bg-indigo-700 rounded-full text-center text-sm uppercase tracking-wider font-medium shadow-inner">
                            Role:{" "}
                            <span className="font-bold capitalize">
                                {"Officer"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Mobile SidebarDashboar menu Button */}
            <div className="">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="ml-4 block md:hidden text-gray-900 focus:outline-none absolute top-0 right-0"
                    aria-label="Open menu"
                >
                    <FaBars size={20} />
                </button>
            </div>

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
                                </div>

                                {/* Search Bar */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Search by name or crime type..."
                                        value={searchQuery}
                                        onChange={handleSearch}
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
                                        <>
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
                                                                        ) ||
                                                                            "N/A"}
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

                                            {/* Pagination Controls */}
                                            {!loading &&
                                                !error &&
                                                criminals.length > 0 && (
                                                    <div className="flex justify-between items-center mt-4 p-4 border-t border-gray-200">
                                                        {/* <div>
                                                            <label
                                                                htmlFor="pageSize"
                                                                className="text-sm text-gray-600 mr-2"
                                                            >
                                                                Show:
                                                            </label>
                                                            <select
                                                                id="pageSize"
                                                                value={limit}
                                                                onChange={(e) =>
                                                                    setLimit(
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                className="border rounded px-2 py-1 text-sm"
                                                            >
                                                                <option
                                                                    value={5}
                                                                >
                                                                    5
                                                                </option>
                                                                <option
                                                                    value={10}
                                                                >
                                                                    10
                                                                </option>
                                                                <option
                                                                    value={20}
                                                                >
                                                                    20
                                                                </option>
                                                            </select>
                                                        </div> */}

                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    setPage(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            Math.max(
                                                                                prev -
                                                                                    1,
                                                                                1
                                                                            )
                                                                    )
                                                                }
                                                                disabled={
                                                                    page === 1
                                                                }
                                                                className={`px-3 py-1 rounded ${
                                                                    page === 1
                                                                        ? "bg-gray-200 cursor-not-allowed"
                                                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                                                }`}
                                                            >
                                                                Previous
                                                            </button>

                                                            <span className="px-2 py-1 border rounded">
                                                                Page {page} of{" "}
                                                                {totalPages}
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    setPage(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            Math.min(
                                                                                prev +
                                                                                    1,
                                                                                totalPages
                                                                            )
                                                                    )
                                                                }
                                                                disabled={
                                                                    page ===
                                                                    totalPages
                                                                }
                                                                className={`px-3 py-1 rounded ${
                                                                    page ===
                                                                    totalPages
                                                                        ? "bg-gray-200 cursor-not-allowed"
                                                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                                                }`}
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                        </>
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {isActiveTab === "profile" && (
                        <div>
                            {/* <h2 className="text-2xl font-bold mb-4">Profile</h2> */}
                            {/* Profile component can be added here */}
                            <Profile />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OfficerDashboard;
