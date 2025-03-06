import React from "react";

const Switcher = ({ isChecked, setIsChecked }) => {
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        {/* Hidden Checkbox */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        
        {/* Switch Track */}
        <div className={`h-6 w-14 rounded-full transition-colors ${isChecked ? "bg-blue-600" : "bg-gray-300"}`}></div>
        
        {/* Toggle Circle */}
        <div
          className={`absolute top-0.5 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
            isChecked ? "translate-x-8" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Switcher;
