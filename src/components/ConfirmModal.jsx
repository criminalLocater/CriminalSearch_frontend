// src/components/ConfirmModal.jsx
import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Action</h3>
        <p className="text-sm text-gray-600 mb-6">{message || "Are you sure you want to perform this action?"}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;