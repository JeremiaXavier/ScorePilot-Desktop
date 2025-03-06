import React from "react";
import welcomeImage from "@/assets/examination.jpg"; // Adjust the path to your image

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-800">
      {/* Image Section */}
      <img src={welcomeImage} alt="Welcome" className="w-80 mb-6" />

      {/* Text Content */}
      <h1 className="text-4xl font-bold mb-4 font-serif">
        Welcome to Digi-Classroom Assessment Portal
      </h1>
      <p className="text-lg text-gray-600">
        Select an option from the sidebar to get started.
      </p>
    </div>
  );
};

export default LandingPage;
