import React, { useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate } from "react-router-dom";

// Don’t lazy load MapPicker unless you're having loader issues
import MapPicker from "../components/MapPicker";

const AddCriminalPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    crimeType: "",
    address: "",
    caseNo: "",
    section: "",
    longitude: "",
    latitude: "",
    status: "Bail",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });

      // Generate preview
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }

    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMapSelect = ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      setError("Please select a valid location on the map.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("crimeType", formData.crimeType);
    data.append("address", formData.address);

    data.append("caseReference[0][caseNo]", formData.caseNo);
    data.append("caseReference[0][section]", formData.section);

    const location = {
      type: "Point",
      coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
    };
    data.append("location", JSON.stringify(location));

    data.append("status", formData.status);

    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      await axiosInstance.post(endpoint.criminal.create, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/criminalpage");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add criminal");
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Criminal</h2>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Crime Type & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="crimeType"
            placeholder="Crime Type"
            value={formData.crimeType}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Case No & Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="caseNo"
            placeholder="Case Number"
            value={formData.caseNo}
            onChange={handleChange}
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Longitude & Latitude */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            readOnly
            className="px-4 py-2 border rounded bg-gray-100"
          />
          <input
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            readOnly
            className="px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Map Picker */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Location on Map
          </label>
          <MapPicker onSelect={handleMapSelect} />
        </div>

        {/* Status Dropdown */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="Bail">Bail</option>
          <option value="Jail">Jail</option>
        </select>

        {/* Photo Upload with Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo
          </label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {/* Image Preview */}
          {photoPreview && (
            <div className="mt-3 flex justify-center">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Criminal
        </button>
      </form>
    </div>
  );
};

export default AddCriminalPage;
