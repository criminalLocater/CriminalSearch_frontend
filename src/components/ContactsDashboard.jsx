import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

const ContactDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch paginated messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endpoint.contact.showall, {
        params: { page, limit }
      });

      if (res.data?.data) {
        setMessages(res.data.data.users || []);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, limit]);

  // Handle delete
  const handleDelete = (id) => {
    setMessageToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const toastId = toast.loading("Deleting message...");
    try {
      await axiosInstance.delete(endpoint.contact.delete + messageToDelete);
      setMessages(messages.filter((m) => m._id !== messageToDelete));
      toast.success("Message deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete message.", { id: toastId });
      console.error("Error deleting message:", err);
    } finally {
      setIsConfirmOpen(false);
      setMessageToDelete(null);
    }
  };

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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && (
        <div className="flex justify-between items-center mt-4">
          {/* <div>
            <label htmlFor="pageSize" className="text-sm text-gray-600 mr-2">
              Show:
            </label>
            <select
              id="pageSize"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div> */}

          <div className="flex space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            <span className="px-2 py-1 border rounded">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete this message? This action cannot be undone.`}
      />
    </div>
  );
};

export default ContactDashboard;