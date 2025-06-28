import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal"; // Adjust path as needed
import { toast } from "react-hot-toast";

const EditStationPage = () => {
    const { id } = useParams(); // Get station ID from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        stationName: "",
        contactNumber: "",
        latitude: "",
        longitude: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Confirmation modal state

    // Load current station data
    useEffect(() => {
        const fetchStation = async () => {
            try {
                const res = await axiosInstance.get(endpoint.station.edit(id));
                if (res.data) {
                    const station = res.data.data;

                    setFormData({
                        stationName: station.stationName,
                        contactNumber: station.contactNumber,
                        latitude: station.location?.coordinates[1] || "",
                        longitude: station.location?.coordinates[0] || "",
                    });
                }
            } catch (err) {
                console.error("Error fetching station:", err);
                setError("Failed to load station data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStation();
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Show confirmation modal before submit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    // Handle actual form submission after confirmation
    const handleSubmit = async () => {
        const updateData = {
            stationName: formData.stationName,
            contactNumber: formData.contactNumber,
            location: {
                type: "Point",
                coordinates: [
                    parseFloat(formData.longitude),
                    parseFloat(formData.latitude),
                ],
            },
        };

        const toastId = toast.loading("Updating station...");

        try {
            const res = await axiosInstance.put(
                endpoint.station.update(id),
                updateData
            );

            if (res.data.status === 200) {
                toast.success("Station updated successfully!", { id: toastId });
                setTimeout(() => {
                    navigate("/stations");
                }, 1000);
            } else {
                throw new Error(res.data.message || "Update failed");
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Failed to update station.";

            toast.error(errorMsg, { id: toastId });
            setError(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading station data...
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Police Station</h2>

            {/* Display error using toast or inline */}
            {error && <p className="mb-4 text-red-500">{error}</p>}

            <form
                onSubmit={handleFormSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                {/* Station Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Station Name</label>
                    <input
                        type="text"
                        name="stationName"
                        value={formData.stationName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Latitude & Longitude */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            placeholder="e.g., 22.6708"
                            required
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="e.g., 88.3789"
                            required
                            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/stations")}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
                    >
                        Update Station
                    </button>
                </div>
            </form>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleSubmit}
                message="Are you sure you want to update this police station?"
            />
        </div>
    );
};

export default EditStationPage;