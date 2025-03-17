import React, { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const MalpracticeWarning = ({ isOpen, onClose }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-gray-900 p-6 rounded-lg shadow-lg w-[400px] text-center border-2 border-red-600 relative ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Blinking Red Icon */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-red-600 flex justify-center"
        >
          <ExclamationTriangleIcon className="w-16 h-16" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-red-600 mt-2 uppercase">
          🚨 You Are Suspended 🚨
        </h2>

        {/* Suspension Message */}
        <p className="text-gray-300 mt-4 font-semibold text-lg">
          Your account has been **suspended** due to **severe malpractice**.
        </p>
        <p className="text-gray-400 mt-2">
          This decision is **final** and has been recorded in your **permanent profile**.
        </p>

        {/* Psychological Pressure */}
        <p className="text-red-500 font-bold mt-3 text-sm animate-pulse">
          The administration has been notified. Any further attempt may result in a **permanent ban**.
        </p>

        {/* Exit Button */}
        <button
          className="mt-6 px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition text-lg w-full"
          onClick={onClose}
        >
          Acknowledge & Exit
        </button>
      </motion.div>

      {/* CSS for Shake Animation */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default MalpracticeWarning;
