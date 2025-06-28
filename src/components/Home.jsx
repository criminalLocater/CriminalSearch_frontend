import React, { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import CriminalList from "../components/CriminalList";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";

const Home = () => {
    const [selectedCriminal, setSelectedCriminal] = useState(null);
    const [criminals, setCriminals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [user] = useState(JSON.parse(localStorage.getItem("user")) || null);

    // Fetch criminals from API
    useEffect(() => {
        const fetchCriminals = async () => {
            try {
                const res = await axiosInstance.get(endpoint.criminal.showall);
                setCriminals(res.data.data || []);
            } catch (err) {
                console.error("Failed to load criminals", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCriminals();
    }, []);

    return (
        <main className="w-full border-0 border-amber-500">
            <div className="w-full p-4 min-h-screen bg-gray-100">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white rounded-b-[4rem] overflow-hidden shadow-2xl h-64 md:h-96 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"></div>
                    <div className="z-10 text-center px-6">
                        <h1 className=" text-3xl sm:text-5xl font-extrabold mb-4">
                            Barrackpore Police Commissionerate
                        </h1>
                        <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                            Search criminal records and view their locations on
                            an interactive map.
                        </p>
                    </div>
                </section>

                {/* Search Bar */}
                <section className="px-4 -mt-10 z-20 relative max-w-3xl mx-auto">
                    <div className="bg-white p-1 rounded-full shadow-xl border border-gray-200 flex items-center">
                        <span className="pl-4 text-gray-500 text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, crime or location..."
                            className="w-full p-4 pl-3 outline-none rounded-full text-gray-700 placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </section>

                {/* Introduction Card */}
                <section className="px-6 py-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-gray-700 leading-relaxed">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                            Welcome to the Criminal Data Portal
                        </h2>
                        <p className="mb-4">
                            This portal provides law enforcement officers and
                            authorized personnel access to criminal data in the
                            Barrackpore region. You can search for criminals by
                            name or filter them based on crimes, and locate them
                            on an interactive map.
                        </p>
                        <p>
                            Use the tools below to find relevant data and
                            support your operations effectively and efficiently.
                        </p>
                    </div>
                </section>
                {user ? (
                    <>
                        {/* Map + Criminal List Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-96">
                                <span className="text-lg text-gray-600">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <section className="px-4 pb-12 max-w-6xl mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Map View */}
                                    <div className="lg:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                                        <h3 className="text-xl font-bold mb-4 px-6 pt-6">
                                            Criminal Map
                                        </h3>
                                        <div className="h-[350px] sm:h-[500px] w-full">
                                            <MapComponent
                                                selectedCriminal={
                                                    selectedCriminal
                                                }
                                                criminals={criminals}
                                            />
                                        </div>
                                    </div>

                                    {/* Criminal List Sidebar */}
                                    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
                                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                                            Criminal List
                                        </h3>
                                        <CriminalList
                                            onSelectCriminal={
                                                setSelectedCriminal
                                            }
                                            criminals={criminals}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                ) : null}
            </div>
        </main>
    );
};

export default Home;
