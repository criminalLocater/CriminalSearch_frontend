import React, { useEffect, useState } from "react";
import axiosInstance from "../Api/AxiosInstance";
import { endpoint } from "../Api/Api";

const CriminalList = ({ onSelectCriminal }) => {
  const [criminals, setCriminals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyCriminals = async () => {
      try {
        const res = await axiosInstance.get(endpoint.criminal.geo, {
          params: {
            lat: 22.6708,
            lng: 88.3789,
            radius: 5000,
          },
        });

        if (res.data.success) {
          setCriminals(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching criminals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyCriminals();
  }, []);

  const handleSelect = (criminal) => {
    onSelectCriminal(criminal);
  };

  const filteredCriminals = criminals.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {loading ? (
        <p>Loading criminals...</p>
      ) : filteredCriminals.length === 0 ? (
        <p>No criminals found</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {filteredCriminals.map((criminal) => (
            <li
              key={criminal._id}
              onClick={() => handleSelect(criminal)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <strong>{criminal.name}</strong> - {criminal.crimeType}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CriminalList;