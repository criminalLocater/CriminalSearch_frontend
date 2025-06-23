import React, {  useState } from "react";


const CriminalList = ({ onSelectCriminal, criminals = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCriminals = criminals.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (criminal) => {
    onSelectCriminal(criminal);
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
      />

      {/* Criminal List */}
      {filteredCriminals.length === 0 ? (
        <p className="text-center text-gray-500">No criminals found</p>
      ) : (
        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredCriminals.map((criminal) => (
            <li
              key={criminal._id}
              onClick={() => handleSelect(criminal)}
              className="p-3 border rounded-md cursor-pointer hover:bg-blue-50 transition"
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