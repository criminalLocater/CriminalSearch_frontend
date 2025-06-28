import React, { useState, useEffect } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();

    // Form Data (including photo)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "officer",
        stationId: "",
        phone: "",
        badgeNumber: "",
        rank: "",
        designation: "",
        joiningDate: "",
    });

    // Photo state
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Options for Select
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Validation & Errors
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    // Fetch Stations
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await axiosInstance.get(
                    endpoint.station.showall
                );
                const data = response.data.data;
                if (Array.isArray(data)) {
                    setStations(data);
                } else {
                    console.warn(
                        "Expected stations to be an array but got:",
                        data
                    );
                    setStations([]);
                }
            } catch (error) {
                console.error("Failed to fetch police stations:", error);
                setStations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStations();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Photo Upload with Preview
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setErrors((prev) => ({
                    ...prev,
                    photo: "Only image files are allowed.",
                }));
                return;
            }

            // Set photo for upload
            setPhoto(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Clear error
            setErrors((prev) => {
                const { photo: _, ...rest } = prev;
                return rest;
            });
        }
    };

    // Validate Form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Full Name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Email is invalid.";
        if (!formData.password) newErrors.password = "Password is required.";
        if (!formData.phone) newErrors.phone = "Phone number is required.";
        if (!formData.rank) newErrors.rank = "Rank is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        if (photo) {
            formDataToSend.append("photo", photo);
        }

        try {
            const response = await axiosInstance.post(
                endpoint.auth.registration,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Registration successful:", response.data);
            setTimeout(() => {
                navigate(redirectPath);
                if (response.data.status === 200) {
                    toast.success("Registration Successfull");
                }
            }, 1000);
            navigate("/login");
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                "An error occurred during registration.";
            toast.error("Registration Failed");

            setSubmitError(errorMsg);
        }
    };

    return (
        <>
            <div className="w-full">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Register
                        </h1>
                        <p className="mt-2 text-sm md:text-base">
                            Create an account for Barrackpore Police
                            Commissionerate
                        </p>
                    </div>
                </section>

                {/* Registration Form */}
                <section className="py-12 bg-gray-50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                Create Account
                            </h2>

                            {/* Submission Error */}
                            {submitError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                    {submitError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.fullName
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.email
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.password
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="officer">Officer</option>
                                        <option value="sic">
                                            Station Incharge (SIC)
                                        </option>
                                    </select>
                                </div>

                                {/* Station ID */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="stationId"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Police Station
                                    </label>
                                    <select
                                        id="stationId"
                                        name="stationId"
                                        value={formData.stationId}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">
                                            Select a Station
                                        </option>
                                        {!loading &&
                                            stations.length > 0 &&
                                            stations.map((station) => (
                                                <option
                                                    key={station.id}
                                                    value={station.id}
                                                >
                                                    {station.stationName}
                                                </option>
                                            ))}
                                        {!loading && stations.length === 0 && (
                                            <option disabled>
                                                No stations found
                                            </option>
                                        )}
                                    </select>
                                    {loading && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            Loading stations...
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.phone
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Badge Number */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="badgeNumber"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Badge Number (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="badgeNumber"
                                        name="badgeNumber"
                                        value={formData.badgeNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Rank */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="rank"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Rank
                                    </label>
                                    <input
                                        type="text"
                                        id="rank"
                                        name="rank"
                                        value={formData.rank}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.rank
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.rank && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.rank}
                                        </p>
                                    )}
                                </div>

                                {/* Designation */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="designation"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Designation (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Joining Date */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="joiningDate"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Joining Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        id="joiningDate"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Photo Upload with Preview */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="photo"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.photo
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.photo && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.photo}
                                        </p>
                                    )}

                                    {/* Photo Preview */}
                                    {photoPreview && (
                                        <div className="mt-3">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-full border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
                                >
                                    Register
                                </button>
                            </form>

                            <p className="mt-4 text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-blue-600 hover:underline"
                                >
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Register;
