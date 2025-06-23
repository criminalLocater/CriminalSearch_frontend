import React, { useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import { endpoint } from "../Api/Api";

const AddPoliceStation = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        stationName: "",
        contactNumber: "",
        location: {
            type: "Point",
            coordinates: [0, 0],
        },
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCoordinateChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                coordinates:
                    name === "longitude"
                        ? [numValue, prev.location.coordinates[1]]
                        : [prev.location.coordinates[0], numValue],
            },
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.stationName)
            newErrors.stationName = "Station Name is required.";
        if (!formData.contactNumber)
            newErrors.contactNumber = "Contact Number is required.";
        if (
            !Array.isArray(formData.location.coordinates) ||
            formData.location.coordinates.length !== 2 ||
            isNaN(formData.location.coordinates[0]) ||
            isNaN(formData.location.coordinates[1])
        ) {
            newErrors.coordinates =
                "Valid longitude and latitude are required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axiosInstance.post(
                endpoint.station.create,
                formData
            );
            setSubmitSuccess(
                "Police station added successfully!",
                response.data
            );
            setSubmitError("");
            setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                "An error occurred while adding the station.";
            setSubmitError(errorMsg);
            setSubmitSuccess("");
        }
    };

    return (
        <>
            <div className="w-full">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Add Police Station
                        </h1>
                        <p className="mt-2 text-sm md:text-base">
                            Register a new police station in Barrackpore
                        </p>
                    </div>
                </section>

                {/* Add Station Form */}
                <section className="py-12 bg-gray-50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                Register Station
                            </h2>

                            {submitSuccess && (
                                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                                    {submitSuccess}
                                </div>
                            )}

                            {submitError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                    {submitError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Station Name */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="stationName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Station Name
                                    </label>
                                    <input
                                        type="text"
                                        id="stationName"
                                        name="stationName"
                                        value={formData.stationName}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.stationName
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.stationName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.stationName}
                                        </p>
                                    )}
                                </div>

                                {/* Contact Number */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="contactNumber"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.contactNumber
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.contactNumber && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.contactNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Location Type (Fixed as Point) */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location Type
                                    </label>
                                    <input
                                        type="text"
                                        value="Point"
                                        readOnly
                                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                                    />
                                </div>

                                {/* Longitude */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="longitude"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        id="longitude"
                                        name="longitude"
                                        step="any"
                                        value={formData.location.coordinates[0]}
                                        onChange={handleCoordinateChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.coordinates
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                </div>

                                {/* Latitude */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="latitude"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        id="latitude"
                                        name="latitude"
                                        step="any"
                                        value={formData.location.coordinates[1]}
                                        onChange={handleCoordinateChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.coordinates
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.coordinates && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.coordinates}
                                        </p>
                                    )}
                                </div>
                                {/* Map Picker */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Location on Map
                                    </label>
                                    <MapPicker
                                        coordinates={
                                            formData.location.coordinates
                                        }
                                        setCoordinates={(coords) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                location: {
                                                    ...prev.location,
                                                    coordinates: coords,
                                                },
                                            }));
                                        }}
                                    />
                                    {errors.coordinates && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.coordinates}
                                        </p>
                                    )}
                                </div>
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
                                >
                                    Add Station
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AddPoliceStation;
