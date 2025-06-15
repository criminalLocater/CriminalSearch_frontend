import React, { useEffect, useState } from "react";

const CriminalList = ({ onSelectCriminal }) => {
  const [criminals, setCriminals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data or fetch from API
    setCriminals([
      {
        id: 1,
        name: "John Doe",
        crime: "Theft",
        latitude: 22.6708,
        longitude: 88.3789,
      },
      {
        id: 2,
        name: "Jane Smith",
        crime: "Fraud",
        latitude: 22.6758,
        longitude: 88.3820,
      },
    ]);
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

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {filteredCriminals.map((criminal) => (
          <li
            key={criminal.id}
            onClick={() => handleSelect(criminal)}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <strong>{criminal.name}</strong> - {criminal.crime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriminalList;