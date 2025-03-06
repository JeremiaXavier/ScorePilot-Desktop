import React from "react";

const ExamWarningModal = ({ isOpen, onStartExam }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600">⚠️ Important Exam Rules</h2>
        <p className="mt-4 text-gray-700">
          Once the exam starts, switching windows or exiting fullscreen mode will lead to **automatic disqualification**.
        </p>
        <p className="text-gray-700">Your time is running now</p>
        <button
          onClick={onStartExam}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Got to Exam
        </button>
      </div>
    </div>
  );
};

export default ExamWarningModal;
