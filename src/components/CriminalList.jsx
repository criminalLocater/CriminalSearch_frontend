import React, {  useState } from "react";


const CriminalList = ({ onSelectCriminal, criminals = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const filteredCriminals = criminals.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCriminals.length / limit);
  const paginatedCriminals = filteredCriminals.slice((page - 1) * limit, page * limit);

  const handleSelect = (criminal) => {
    onSelectCriminal(criminal);
  };
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when limit changes
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
      {/* Page Size Selector */}
      <div className="mb-2 flex items-center">
        <label htmlFor="pageSize" className="mr-2 text-sm text-gray-600">Show:</label>
        <select
          id="pageSize"
          value={limit}
          onChange={handleLimitChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      {/* Criminal List */}
      {filteredCriminals.length === 0 ? (
        <p className="text-center text-gray-500">No criminals found</p>
      ) : (
        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
          {paginatedCriminals.map((criminal) => (
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
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-3">
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
          <span className="px-2 py-1 border rounded text-sm">
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
      )}
    </div>
  );
};

export default CriminalList;