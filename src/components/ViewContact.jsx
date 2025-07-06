import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { endpoint } from "../Api/Api";

const ViewContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axiosInstance.get(endpoint.contact.edit + id);
        setMessage(res.data.data || {});
      } catch (err) {
        console.error("Failed to load message", err);
        setMessage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading) {
    return <p>Loading message...</p>;
  }

  if (!message) {
    return <p>Message not found.</p>;
  }

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">View Contact Message</h2>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
        <div>
          <strong>Name:</strong> {message.name || "Anonymous"}
        </div>
        <div>
          <strong>Email:</strong> {message.email || "N/A"}
        </div>
        <div>
          <strong>Message:</strong>
          <p className="mt-2 p-3 bg-gray-100 rounded">{message.message}</p>
        </div>
        <div>
          <strong>Sent at:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          ← Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewContact;