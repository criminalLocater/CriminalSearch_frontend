// src/pages/AddCriminalPage.jsx
import React, { useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";
import { useNavigate } from "react-router-dom";

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
    // const [photo, setPhoto] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photo") {
            setFormData({ ...formData, photo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log("formData ", formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate coordinates
        // if (!formData.longitude || !formData.latitude) {
        //     setError("Please enter both Longitude and Latitude.");
        //     return;
        // }

        // const formDataToSend = new FormData();

        // // Append all primitive fields
        // Object.entries(formData).forEach(([key, value]) => {
        //     if (value !== undefined && value !== null) {
        //         formDataToSend.append(key, value);
        //     }
        // });

        // // Format and append location as JSON string
        // const location = {
        //     type: "Point",
        //     coordinates: [
        //         parseFloat(formData.longitude),
        //         parseFloat(formData.latitude),
        //     ],
        // };

        // formDataToSend.append("location", JSON.stringify(location));

        // // Append photo if selected
        // if (photo) {
        //     formDataToSend.append("photo", photo);
        // }

        // // Log actual content of formDataToSend
        // for (let pair of formDataToSend.entries()) {
        //     console.log(pair[0] + ": ", pair[1]);
        // }
        // Build caseReference array
        const caseReference = [
            {
                caseNo: formData.caseNo,
                section: formData.section,
            },
        ];
        // Build location object
        const location = {
            type: "Point",
            coordinates: [
                parseFloat(formData.longitude),
                parseFloat(formData.latitude),
            ],
        };
        // Create FormData object
        const data = new FormData();
        data.append("name", formData.name);
        data.append("age", formData.age);
        data.append("crimeType", formData.crimeType);
        data.append("address", formData.address);
        data.append("caseReference[0][caseNo]", formData.caseNo);
        data.append("caseReference[0][section]", formData.section);
        data.append("location", JSON.stringify(location)); // stringify GeoJSON
        data.append("status", formData.status);
        data.append("photo", formData.photo); // append the file

        // Log actual content of FormData
        console.log("FormData Contents:");
        for (let pair of data.entries()) {
            console.log(pair[0] + ": ", pair[1]);
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Add New Criminal
            </h2>

            {error && <p className="mb-4 text-red-500">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-4"
                encType="multipart/form-data"
            >
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

                    <input
                        name="longitude"
                        placeholder="Longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        name="latitude"
                        placeholder="Latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Bail">Bail</option>
                    <option value="Jail">Jail</option>
                </select>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Photo
                    </label>
                    <input
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        // onChange={(e) => setPhoto(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

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
                        Save Criminal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCriminalPage;
