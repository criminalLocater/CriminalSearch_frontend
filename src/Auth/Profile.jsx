import React, { useState } from "react";

const Profile = () => {
  // Get user from localStorage
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);

  // Load user data from localStorage on mount
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Handle form submit (update user)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (photo) {
        data.append("file", photo);
      }

      // You can now send this data to your backend
      // Example:
      // await axiosInstance.put(endpoint.auth.UpdateProfile, data, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile.", err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Photo */}
          <div className="relative">
            <img
              src={user?.photo ? user.photo : "https://via.placeholder.com/150"} 
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-2 border-indigo-500"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer text-xs">
                <input type="file" onChange={handlePhotoChange} className="hidden" accept="image/*" />
                📸
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4 w-full">
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={user.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={user.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={user.phone || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Badge Number</label>
                    <input
                      type="text"
                      name="badgeNumber"
                      defaultValue={user.badgeNumber || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rank</label>
                    <input
                      type="text"
                      name="rank"
                      defaultValue={user.rank || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      defaultValue={user.designation || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{user.fullName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold capitalize">{user.role || "Guest"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Badge Number</p>
                  <p className="font-semibold">{user.badgeNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rank</p>
                  <p className="font-semibold">{user.rank || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-semibold">{user.designation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joining Date</p>
                  <p className="font-semibold">
                    {user.joiningDate
                      ? new Date(user.joiningDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Station ID</p>
                  <p className="font-semibold">{user.stationId || "N/A"}</p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;