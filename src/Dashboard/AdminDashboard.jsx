import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import UserTable from "../components/UserTable";
import StationListPage from "../components/StationList";
import Profile from "../Auth/Profile";
import ContactDashboard from "../components/ContactsDashboard";
import SidebarDashboard from "./SidebarDashboard";
import { FaBars } from "react-icons/fa";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";

const AdminDashboard = () => {
    const [isActiveTab, setIsActiveTab] = useState("manageusers");
    const [sidebarOpen, setSidebarOpen] = useState(false); // Unified state for sidebar
    const [usersNumber,setUsersNumber] = useState(0)
    const [activeStation,setActiveStation] = useState(0)

    function handleActiveTab(tab) {
        console.log(tab);
        setIsActiveTab(tab);
    }
    //console.log("sidebarOpen ", sidebarOpen);

    const adminTabs = [
        { name: "Manage Users", tab: "manageusers" },
        { name: "Manage Stations", tab: "managestations" },
        { name: "Contact Messages", tab: "contactdashboard" },
        { name: "Profile", tab: "profile" },
    ];
    const fetchUsers = async () => {
        try {
            const usersres = await axiosInstance.get(endpoint.auth.showall);
            const stationsres = await axiosInstance.get(endpoint.station.showall);
            //console.log("users length ",usersres.data.data.total);
            //console.log("stationsres length ",stationsres.data.data.total);

            setUsersNumber(usersres.data.data.total)
            setActiveStation(stationsres.data.data.total)
        } catch (err) {
            console.error("Error fetching users:", err);
        } 
    };
    useEffect(()=>{
        fetchUsers()
    },[usersNumber,activeStation])

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Sidebar */}
            {sidebarOpen && (
                <SidebarDashboard
                    role="admin"
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
                        {adminTabs.map((link, index) => {
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
                                {"Admin"}
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
            {/* Main Content */}

            {/* Scrollable Main Area */}
            <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div
                        className={` rounded-lg shadow-md text-white p-6 bg-blue-500`}
                    >
                        <h3 className="text-lg font-medium">
                            Officers
                        </h3>
                        <p className="text-3xl font-bold mt-2">{usersNumber}</p>
                    </div>
                    <div
                        className={` rounded-lg shadow-md text-white p-6 bg-yellow-500`}
                    >
                        <h3 className="text-lg font-medium">
                            Active Stations
                        </h3>
                        <p className="text-3xl font-bold mt-2">{activeStation}</p>
                    </div>
                    <div className="space-y-4">
                        <button
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
                            onClick={() => window.location.replace("/register")}
                        >
                            Add New Officer
                        </button>
                        <button
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                            onClick={() =>
                                window.location.replace("/addstation")
                            }
                        >
                            Register New Station
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Left Column - User Management */}
                    <div className="order-2 lg:order-1 md:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        {/* Conditional Rendering Based on isActiveTab */}
                        {isActiveTab === "manageusers" && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                    User Management
                                </h2>
                                <UserTable />
                            </div>
                        )}
                        {isActiveTab === "managestations" && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                    Station Management
                                </h2>
                                <StationListPage />
                            </div>
                        )}
                        {isActiveTab === "contactdashboard" && (
                            <div>
                                <ContactDashboard />
                            </div>
                        )}{" "}
                        {isActiveTab === "profile" && (
                            <div>
                                <Profile />
                            </div>
                        )}{" "}
                    </div>

                    {/* Right Column - Quick Actions */}
                </div>
                <div className="order-1 md:order-2 bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Quick Actions
                    </h2>

                    {/* Recent Activity */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                            Recent Activity
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Krishna Baditya added as Inspector</li>
                            <li>• Naihati PS updated its contact info</li>
                            <li>• 3 new officers registered today</li>
                            <li>• Fraud case #456 assigned to Officer Singh</li>
                        </ul>
                    </div>

                    {/* System Status */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-2">
                            System Status
                        </h3>
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
            </main>
        </div>
    );
};

export default AdminDashboard;
