import React, { useEffect, useState, lazy, Suspense } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal"; // Adjust path as needed
import { toast } from "react-hot-toast";

const MapPicker = lazy(() => import("../components/MapPicker"));

const EditCriminalPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");
  const [error, setError] = useState("");

  // Fetch current criminal data
  useEffect(() => {
    const fetchCriminal = async () => {
      try {
        const response = await axiosInstance.get(endpoint.criminal.edit(id));
        const criminal = response.data.data;

        // Set form data
        setFormData({
          name: criminal.name || "",
          age: criminal.age || "",
          crimeType: criminal.crimeType || "",
          address: criminal.address || "",
          caseNo: criminal.caseReference[0]?.caseNo || "",
          section: criminal.caseReference[0]?.section || "",
          longitude: criminal.location?.coordinates[0] || "",
          latitude: criminal.location?.coordinates[1] || "",
          status: criminal.status || "Bail",
          photo: null,
        });

        if (criminal.photo) {
          setCurrentPhotoUrl(criminal.photo);
        }
      } catch (err) {
        console.error("Error fetching criminal:", err);
        setError("Failed to load criminal data.");
        toast.error("Failed to load criminal data.");
      }
    };

    fetchCriminal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
      setCurrentPhotoUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectLocation = ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!formData.longitude || !formData.latitude) {
      toast.error("Please select a valid location on the map.");
      return;
    }

    setIsConfirmOpen(true); // Open confirm modal
  };

  const handleConfirmSubmit = async () => {
    const toastId = toast.loading("Updating criminal...");

    const caseReference = [
      {
        caseNo: formData.caseNo,
        section: formData.section,
      },
    ];

    formData.caseReference = caseReference;

    const location = {
      type: "Point",
      coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
    };

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("crimeType", formData.crimeType);
    data.append("address", formData.address);
    data.append("caseReference[0][caseNo]", formData.caseNo);
    data.append("caseReference[0][section]", formData.section);
    data.append("location", JSON.stringify(location));
    data.append("status", formData.status);

    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      await axiosInstance.put(endpoint.criminal.update(id), data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Criminal updated successfully!", { id: toastId });
      setTimeout(() => navigate("/criminalpage"), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update criminal";
      toast.error(errorMsg, { id: toastId });
      setError(errorMsg);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Criminal</h2>

      {/* Error shown via toast only */}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmitClick} encType="multipart/form-data" className="bg-white p-6 rounded-lg shadow-md space-y-6">
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

        {/* Longitude & Latitude Inputs */}
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
          <Suspense fallback="Loading map...">
            <MapPicker onSelect={handleSelectLocation} />
          </Suspense>
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

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo
          </label>
          {currentPhotoUrl && (
            <img
              src={currentPhotoUrl}
              alt="Current"
              className="w-32 h-32 object-cover mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-4">
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
            Update Criminal
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        message="Are you sure you want to update this criminal's information?"
      />
    </div>
  );
};

export default EditCriminalPage;