import React, { useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import { toast } from "react-hot-toast";
import { endpoint } from "../Api/Api";

const AddPoliceStation = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        stationName: "",
        contactNumber: "",
        location: {
            type: "Point",
            coordinates: [88.3789, 22.6708], // GeoJSON [lng, lat]
        },
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    // Handle input changes for name and contact
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle map selection
    const handleMapSelect = (coords) => {
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                coordinates: [coords.lng, coords.lat],
            },
        }));
    };

    // Validate form before submit
    const validateForm = () => {
        const newErrors = {};

        if (!formData.stationName.trim()) {
            newErrors.stationName = "Station Name is required.";
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact Number is required.";
        }

        const [lng, lat] = formData.location.coordinates;
        if (!lng || !lat || isNaN(lng) || isNaN(lat)) {
            newErrors.coordinates = "Please pick a valid location on the map.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await axiosInstance.post(endpoint.station.create, formData);
            setSubmitSuccess("Police station added successfully!");
            setSubmitError("");

            setTimeout(() => {
                toast.success("Police station added Successfull");

                navigate("/");
            }, 2000);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "An error occurred while adding the station.";

            setSubmitError(errorMsg);
            setSubmitSuccess("");
        }
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen py-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Add Police Station
                </h1>
                <p className="mt-2 text-sm md:text-base">
                    Register a new police station in Barrackpore
                </p>
            </section>

            {/* Form Section */}
            <section className="py-10 px-4">
                <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Register Station
                    </h2>

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                            {submitSuccess}
                        </div>
                    )}

                    {/* Error Message */}
                    {submitError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Station Name */}
                        <div>
                            <label
                                htmlFor="stationName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Station Name
                            </label>
                            <input
                                id="stationName"
                                name="stationName"
                                type="text"
                                value={formData.stationName}
                                onChange={handleChange}
                                placeholder="Enter station name"
                                className={`w-full px-4 py-2 border rounded focus:outline-none ${
                                    errors.stationName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.stationName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.stationName}
                                </p>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label
                                htmlFor="contactNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Contact Number
                            </label>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                                className={`w-full px-4 py-2 border rounded focus:outline-none ${
                                    errors.contactNumber
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.contactNumber && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.contactNumber}
                                </p>
                            )}
                        </div>

                        {/* Location Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location Type
                            </label>
                            <input
                                type="text"
                                value="Point"
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded"
                            />
                        </div>

                        {/* Longitude */}
                        <div>
                            <label
                                htmlFor="longitude"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Longitude
                            </label>
                            <input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                value={formData.location.coordinates[0]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        location: {
                                            ...prev.location,
                                            coordinates: [
                                                parseFloat(e.target.value),
                                                prev.location.coordinates[1],
                                            ],
                                        },
                                    }))
                                }
                                placeholder="Longitude"
                                className={`w-full px-4 py-2 border rounded focus:outline-none ${
                                    errors.coordinates
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                        </div>

                        {/* Latitude */}
                        <div>
                            <label
                                htmlFor="latitude"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Latitude
                            </label>
                            <input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                value={formData.location.coordinates[1]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        location: {
                                            ...prev.location,
                                            coordinates: [
                                                prev.location.coordinates[0],
                                                parseFloat(e.target.value),
                                            ],
                                        },
                                    }))
                                }
                                placeholder="Latitude"
                                className={`w-full px-4 py-2 border rounded focus:outline-none ${
                                    errors.coordinates
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                        </div>

                        {/* Map Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Location on Map
                            </label>
                            <MapPicker onSelect={handleMapSelect} />
                            {errors.coordinates && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.coordinates}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200"
                        >
                            Add Station
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default AddPoliceStation;
