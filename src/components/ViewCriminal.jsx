import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { endpoint } from "../Api/Api";

const ViewCriminal = () => {
    const [criminal, setCriminal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User in view criminal ", user);
    console.log("User role in view criminal ", user.role);

    // Fetch criminal by ID
    useEffect(() => {
        const fetchCriminal = async () => {
            try {
                const response = await axiosInstance.get(
                    endpoint.criminal.edit(id)
                );
                setCriminal(response.data.data || {});
                console.log(response.data.data);
            } catch (err) {
                setError("Failed to load criminal details");
                console.error("Error fetching criminal:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCriminal();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading criminal details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-600 p-6 text-center">
                <h2 className="text-xl font-bold">Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => {
                        user.role === "sic"
                            ? navigate("/sic/criminalpage")
                            : navigate("/officer");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!criminal || !criminal._id) {
        return (
            <div className="flex flex-col justify-center items-center h-screen p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800">
                    Criminal Not Found
                </h2>
                <p className="text-gray-500 mt-2">
                    No criminal found with this ID.
                </p>
                <button
                    onClick={() => {
                        user.role === "sic"
                            ? navigate("/sic/criminalpage")
                            : navigate("/officer");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const {
        name,
        age,
        crimeType,
        address,
        caseReference = [],
        status,
        photo,
        location,
    } = criminal;

    const coordinates = location?.coordinates || [];
    const caseNo = caseReference[0]?.caseNo || "N/A";
    const section = caseReference[0]?.section || "N/A";

    return (
        <div className="w-full min-h-screen bg-gray-100 pb-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
                <p className="mt-2 text-sm md:text-base">
                    Details for {crimeType} | Status:{" "}
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            status === "Jail"
                                ? "bg-red-200 text-red-800"
                                : "bg-green-200 text-green-800"
                        }`}
                    >
                        {status}
                    </span>
                </p>
            </section>

            <div className="container mx-auto px-4 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Criminal Info */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="space-y-6">
                            {/* Photo */}
                            {photo && (
                                <div className="flex justify-center mb-6">
                                    <img
                                        src={photo}
                                        alt={`${name}'s photo`}
                                        className="w-32 h-32 object-cover rounded-md shadow-md"
                                    />
                                </div>
                            )}

                            {/* Criminal Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Name
                                    </label>
                                    <p className="font-semibold text-gray-800">
                                        {name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Age
                                    </label>
                                    <p className="font-semibold text-gray-800">
                                        {age || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Crime Type
                                    </label>
                                    <p className="font-semibold text-gray-800">
                                        {crimeType || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Address
                                    </label>
                                    <p className="font-semibold text-gray-800">
                                        {address || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Case Number
                                    </label>
                                    <p className="font-semibold text-gray-800">
                                        {caseNo}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Section
                                    </label>
                                    <p className="font-semibold text-gray-800">
                                        {section}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Status
                                    </label>
                                    <p
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                            status === "Jail"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {status}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}

                            <div className="mt-8 flex justify-start gap-4">
                                {/* {user.role === "sic" && (
                                    <button
                                        // onClick={() => navigate(`/editcriminal/${id}`)}
                                        onClick={() =>
                                            (window.location.href = `/editcriminal/${criminal._id}`)
                                        }
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
                                    >
                                        Edit Criminal
                                    </button>
                                )} */}
                                <button
                                    // onClick={() => {user.role === "sic" ? navigate("/sic/criminalpage") : navigate(-1)}}
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200"
                                >
                                    ← Back to List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Map */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Location
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This criminal was last seen at:
                        </p>

                        <div className="h-96 w-full rounded-lg overflow-hidden shadow-inner border border-gray-300 bg-gray-200">
                            {coordinates.length >= 2 ? (
                                <MapComponent
                                    selectedCriminal={criminal}
                                    criminals={[criminal]}
                                />
                            ) : (
                                <p className="h-full flex justify-center items-center text-gray-500">
                                    No location data available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCriminal;
