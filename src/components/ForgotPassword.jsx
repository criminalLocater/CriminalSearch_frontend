import React, { useState } from "react";
import { endpoint } from "../Api/Api";
import axiosInstance from "../Api/AxiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(endpoint.auth.forgotPassword, {
        email,
      });

      setMessage(response.data.message || "Password reset link sent to your email.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200"
          >
            Send Reset Link
          </button>
        </form>

        {/* Success Message */}
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <a href="/login" className="text-indigo-600 hover:text-indigo-800 text-sm">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;