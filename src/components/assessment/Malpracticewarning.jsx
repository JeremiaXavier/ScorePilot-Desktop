import React from "react";

const MalpracticeWarning = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Hide if modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-red-600">⚠ Malpractice Detected!</h2>
        <p className="text-gray-700 mt-3">
          You will be redirected to the dashboard due to malpractice detection.
        </p>
        <button
          className="mt-5 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MalpracticeWarning;
