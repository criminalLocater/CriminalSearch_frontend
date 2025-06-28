import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

const ContactDashboard = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const navigate = useNavigate();

  // Fetch all contact messages
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(endpoint.contact.showall); // Ensure this is defined in Api.js
      console.log("Fetched messages:", res.data.data);
      
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  const handleDelete = async (id) => {
    setIsConfirmOpen(true);
    setUserToDelete(id);
  };
  const confirmDelete = async () => {
    const toastId = toast.loading("Deleting message...");
    try {
      await axiosInstance.delete(endpoint.contact.delete + userToDelete);
      setMessages(messages.filter((m) => m.id !== userToDelete));
      toast.success("Message deleted successfully!", { id: toastId });
      window.location.replace("/admin"); // Reload to reflect changes
    } catch (err) {
      toast.error("Failed to delete message.", { id: toastId });
      console.error("Error deleting message:", err);
    } finally {
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };
    

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading contact messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Messages</h2>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              )}

              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {msg.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {msg.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {msg.message || "No message"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/contact/viewcontact/${msg._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Confirm Modal */}
        {/* Confirmation Modal for Deletion */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
            />
    </div>
  );
};

export default ContactDashboard;