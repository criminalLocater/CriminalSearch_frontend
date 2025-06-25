import React, { useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
``;
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Email is invalid.";
        if (!formData.password) newErrors.password = "Password is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setSubmitError("");

        try {
            const response = await axiosInstance.post(
                endpoint.auth.login,
                formData
            ); // Make sure this matches your endpoint
            console.log("Login successful:", response.data);

            // Save token and user data to localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data));
            const user = JSON.parse(localStorage.getItem("user"));
            console.log("User role:", user);

            // Redirect based on role
            const redirectPath =
                response.data.data.role === "admin" ? "/register" : "/";
            if (user.role === "admin") navigate("/admin");
            if (user.role === "sic") navigate("/sic");

            setTimeout(() => {
                navigate(redirectPath);
                alert("Login successful!");
                window.location.reload();
            }, 1000);
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                "An error occurred during login.";
            setSubmitError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Login
                        </h1>
                        <p className="mt-2 text-sm md:text-base">
                            Welcome back to Barrackpore Police Commissionerate
                        </p>
                    </div>
                </section>

                {/* Login Form */}
                <section className="py-12 bg-gray-50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                Sign In
                            </h2>

                            {submitError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                    {submitError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
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
                                        placeholder="you@example.com"
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
                                <div className="relative mb-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="h-7 w-7 absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            // Eye Closed Icon
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        ) : (
                                            // Eye Open Icon
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 left-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.028m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L7 12.76m5.94-5.94L15.76 7M5 19.129l-1.45-1.45A9.97 9.97 0 013 12c1.274-4.057 5.064-7 9.542-7 1.225 0 2.4.25 3.48.712l1.45-1.45a1.996 1.996 0 00-2.828-2.83l-1.45 1.45A9.97 9.97 0 005 12c0 .897.123 1.76.348 2.575l1.45 1.45z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex justify-between items-center mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </span>
                                    </label>
                                    <a
                                        href="/forgotpassword"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ${
                                        loading
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form> 
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Login;
