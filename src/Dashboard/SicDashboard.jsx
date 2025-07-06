import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CriminalList from "../components/CriminalList";
import MapComponent from "../components/MapComponent";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import CriminalPage from "../components/CriminalPage";
import AddCriminalPage from "../components/AddCriminal";
import Profile from "../Auth/Profile";
import SidebarDashboard from "./SidebarDashboard";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const SicDashboard = () => {
    const [criminals, setCriminals] = useState([]);
    const [selectedCriminal, setSelectedCriminal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isActiveTab, setIsActiveTab] = useState("sic");
    const [sidebarOpen, setSidebarOpen] = useState(false); // Unified state for sidebar

    function handleActiveTab(tab) {
        console.log(tab);
        setIsActiveTab(tab);
    }

    // Fetch criminals from API
    useEffect(() => {
        const fetchCriminals = async () => {
            try {
                const response = await axiosInstance.get(
                    endpoint.criminal.showall
                ); // Replace with your real endpoint
                const data = response.data;
                console.log("criminal data", data);
                console.log("criminal data", data.data);
                console.log("criminal data", data.data.users);

                if (data.success) {
                    setCriminals(data.data.users);
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
    const sicTabs = [
        { name: "View Criminal", tab: "sic" },
        { name: "Manage Criminals", tab: "criminalpage" },
        { name: "Profile", tab: "profile" },
    ];

    return (
        <div className="w-full flex h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 relative">
            {/* Sidebar */}
            {sidebarOpen && (
                <SidebarDashboard
                    role="sic"
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
                        {sicTabs.map((link, index) => {
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
                                {"SIC"}
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

            {isActiveTab === "sic" && (
                <>
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center flex-1 h-full">
                                <span className="text-lg text-gray-600">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <main className="flex-1 p-6 overflow-auto">
                                {/* Header + Add Criminal Button */}
                                <section className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Criminal Records
                                        </h2>
                                        <button
                                            onClick={() =>
                                                (window.location.href =
                                                    "/addcriminal")
                                            }
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition duration-200"
                                        >
                                            Add New Criminal
                                        </button>
                                    </div>
                                </section>

                                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    {/* Criminal List */}
                                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-700 px-6 pt-6">
                                            Criminal List
                                        </h3>
                                        <div className="px-6 pb-6 flex-1 overflow-y-auto">
                                            <CriminalList
                                                onSelectCriminal={
                                                    setSelectedCriminal
                                                }
                                                criminals={criminals}
                                            />
                                        </div>
                                    </div>

                                    {/* Map */}
                                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                                        <div className="px-6 pt-6">
                                            <h3 className="text-xl font-semibold mb-2 text-gray-700">
                                                Criminal Location Map
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Click on a criminal to view
                                                their location.
                                            </p>
                                        </div>
                                        <div className="flex-1 rounded-b-xl overflow-hidden shadow-lg border-t border-gray-100">
                                            <MapComponent
                                                selectedCriminal={
                                                    selectedCriminal
                                                }
                                                criminals={criminals}
                                            />
                                        </div>
                                    </div>
                                </section>
                            </main>
                        )}
                    </div>
                </>
            )}
            {isActiveTab === "criminalpage" && (
                <>
                    <CriminalPage />
                </>
            )}
            {isActiveTab === "profile" && (
                <>
                    <Profile />
                </>
            )}
            {/* {isActiveTab === "addcriminal" && (
                <>
                    <AddCriminalPage />
                </>
            )} */}
        </div>
    );
};

export default SicDashboard;
