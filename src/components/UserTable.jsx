import React, { useState, useEffect } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import ConfirmModal from "./ConfirmModal";

const UserTable = () => {
    const [stations, setStations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(endpoint.auth.showall);
            console.log("Fetched users:", res.data.data);

            setUsers(res.data.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDelete = (user) => {
        if (
            window.confirm(`Are you sure you want to delete ${user.fullName}?`)
        ) {
            axiosInstance
                .delete(endpoint.auth.delete + user.id)
                .then(() => {
                    setUsers(users.filter((u) => u.id !== user.id));
                    ConfirmModal({
                        isOpen: true,
                        title: "User Deleted",
                        message: `${user.fullName} has been deleted successfully.`,
                        onClose: () => {
                            ConfirmModal({ isOpen: false });
                        },
                    });
                })
                .catch((err) => {
                    alert("Failed to delete user.");
                    console.error("Error deleting user:", err);
                });
        }
    };
    // Handle edit button click
    const handleEdit = (user) => {
        // If backend uses `_id`:
        setSelectedUser({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            stationId: user.stationId || "",
            badgeNumber: user.badgeNumber || "",
            rank: user.rank || "",
            designation: user.designation || "",
            joiningDate: user.joiningDate || "",
            phone: user.phone || "",
        });
        setShowEditModal(true);
    };

    // Handle input changes in modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

    // Handle update
    const handleUpdate = async () => {
        if (!selectedUser || !selectedUser.id) {
            alert("Invalid user selected.");
            return;
        }

        try {
            const updatePayload = {
                fullName: selectedUser.fullName,
                email: selectedUser.email,
                role: selectedUser.role,
                stationId: selectedUser.stationId,
                badgeNumber: selectedUser.badgeNumber,
                rank: selectedUser.rank,
                designation: selectedUser.designation,
                joiningDate: selectedUser.joiningDate,
                phone: selectedUser.phone,
            };

            // Remove empty values if needed
            Object.keys(updatePayload).forEach((key) => {
                if (
                    updatePayload[key] === undefined ||
                    updatePayload[key] === ""
                ) {
                    delete updatePayload[key];
                }
            });

            await axiosInstance.put(
                `${endpoint.auth.updateProfile}${selectedUser.id}`,
                updatePayload
            );

            setShowEditModal(false);
            fetchUsers(); // Refresh list after update
        } catch (err) {
            console.error(
                "Error updating user:",
                err.response?.data || err.message
            );
            alert("Failed to update user");
        }
    };
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

    if (loading) {
        return <p className="text-center py-10">Loading users...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center py-10">{error}</p>;
    }

    return (
        <div className="overflow-x-auto">
            {/* Users Table */}

            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 border-b text-left">Name</th>
                        <th className="py-3 px-4 border-b text-left">Email</th>
                        <th className="py-3 px-4 border-b text-left">
                            Name of the PS
                        </th>
                        <th className="py-3 px-4 border-b text-left">Role</th>
                        <th className="py-3 px-4 border-b text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="py-6 text-center text-gray-500 italic"
                            >
                                No users found.
                            </td>
                        </tr>
                    )}

                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition"
                        >
                            <td className="py-4 px-4 border-b">
                                {user.fullName}
                            </td>
                            <td className="py-4 px-4 border-b">{user.email}</td>
                            <td className="py-4 px-4 border-b">
                                {user.stationId}
                            </td>
                            <td className="py-4 px-4 border-b capitalize">
                                {user.role}
                            </td>
                            <td className="py-4 px-4 border-b text-right space-x-2">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={selectedUser.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                                    value={selectedUser.stationId}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    <option value="">Select a station</option>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={selectedUser.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="sic">SIC</option>
                                    <option value="officer">Officer</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
