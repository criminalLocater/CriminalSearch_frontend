import React, { useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate } from "react-router-dom";
import MapPicker from "../components/MapPicker";

const AddCriminalPage = () => {
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
  const [Photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMapSelect = (coords) => {
    // Update form inputs when user clicks on map
    setFormData((prev) => ({
      ...prev,
      longitude: coords.lng,
      latitude: coords.lat,
    }));
    
    // Update coordinates state for backend
    setCoordinates([coords.lng, coords.lat]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.longitude || !formData.latitude) {
      setError("Please select a location on the map.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("crimeType", formData.crimeType);
    data.append("address", formData.address);
    data.append("caseNo", formData.caseNo);
    data.append("section", formData.section);
    data.append("status", formData.status);
    data.append("photo", formData.photo);

    // Append location as GeoJSON string
    const location = {
      type: "Point",
      coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
    };
    data.append("location", JSON.stringify(location));

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
  // Handle Photo Upload with Preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Only image files are allowed.",
        }));
        return;
      }

      // Set photo for upload
      setPhoto(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
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

        {/* Latitude & Longitude (Hidden or Read-only) */}
        <div className="grid grid-cols-2 gap-4">
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
        <div className="mt-4 border border-gray-300 rounded-md overflow-hidden shadow-md">
          <MapPicker coordinates={coordinates} setCoordinates={setCoordinates} onSelect={handleMapSelect} />
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
              <div className="mb-4">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.photo
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.photo && (
                  <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
                )}

                {/* Photo Preview */}
                {photoPreview && (
                  <div className="mt-3">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full border border-gray-300"
                    />
                  </div>
                )}
              </div>

        {/* Submit / Cancel */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/criminalpage")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Criminal
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCriminalPage;