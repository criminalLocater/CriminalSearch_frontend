import React, { useState, useEffect } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-hot-toast";

const UserTable = () => {
    const [stations, setStations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(endpoint.auth.showall);
            setUsers(res.data.data || []);
        } catch (err) {
            setError("Failed to load user data");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDelete = (user) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };

    // Confirm deletion via modal
    const confirmDelete = async () => {
        const toastId = toast.loading("Deleting user...");
        try {
            await axiosInstance.delete(endpoint.auth.delete + userToDelete.id);
            setUsers(users.filter((u) => u.id !== userToDelete.id));
            toast.success("User deleted successfully!", { id: toastId });
        } catch (err) {
            toast.error("Failed to delete user.", { id: toastId });
            console.error("Error deleting user:", err);
        } finally {
            setIsConfirmOpen(false);
            setUserToDelete(null);
        }
    };

    // Handle edit button click
    const handleEdit = (user) => {
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
            toast.error("Invalid user selected.");
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

            Object.keys(updatePayload).forEach((key) => {
                if (
                    updatePayload[key] === undefined ||
                    updatePayload[key] === ""
                ) {
                    delete updatePayload[key];
                }
            });

            const toastId = toast.loading("Updating user...");

            await axiosInstance.put(
                `${endpoint.auth.updateProfile}${selectedUser.id}`,
                updatePayload
            );

            toast.success("User updated successfully!", { id: toastId });
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update user", {
                id: toast.loading("Updating user..."),
            });
            console.error("Error updating user:", err);
        }
    };

    // Fetch police stations
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await axiosInstance.get(endpoint.station.showall);
                const data = response.data.data;
                setStations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch police stations:", error);
                setStations([]);
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
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4  text-left">Name</th>
                        <th className="py-3 px-4  text-left">Email</th>
                        <th className="py-3 px-4  text-left">Police Station</th>
                        <th className="py-3 px-4  text-left">Role</th>
                        <th className="py-3 px-4  text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                                No users found.
                            </td>
                        </tr>
                    )}
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                            <td className="py-4 px-4 ">{user.fullName}</td>
                            <td className="py-4 px-4 ">{user.email}</td>
                            <td className="py-4 px-4 ">{user.stationId || "-"}</td>
                            <td className="py-4 px-4 capitalize">{user.role}</td>
                            <td className="py-4 px-4 text-center space-x-2">
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
                            <div className="mb-4">
                                <label htmlFor="stationId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Police Station
                                </label>
                                <select
                                    id="stationId"
                                    name="stationId"
                                    value={selectedUser.stationId}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a station</option>
                                    {stations.map((station) => (
                                        <option key={station.id} value={station.id}>
                                            {station.stationName}
                                        </option>
                                    ))}
                                </select>
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

export default UserTable;