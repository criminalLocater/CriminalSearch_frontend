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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Fetch users with pagination
    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(endpoint.auth.showall, {
                params: { page, limit }
            });
            console.log("users list ",res.data);

            if (res.data?.data) {
                setUsers(res.data.data.users || []);
                
                setTotalPages(res.data.data.totalPages || 1);
            }
        } catch (err) {
            setError("Failed to load user data");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    // Handle user deletion
    const handleDelete = (user) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

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

    return (
        <div className="overflow-x-auto">
            {/* Users Table */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Police Station</th>
                        <th className="py-3 px-4 text-left">Role</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                                Loading users...
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                                No users found.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-4">{user.fullName}</td>
                                <td className="py-4 px-4">{user.email}</td>
                                <td className="py-4 px-4">{user.stationId || "-"}</td>
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
                        ))
                    )}
                </tbody>
            </table>

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