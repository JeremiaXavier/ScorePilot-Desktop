import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import toast from "react-hot-toast";
import MalpracticeWarning from "@/components/assessment/Malpracticewarning";
import { useAuthStore } from "@/store/auth-slice";
import { auth } from "@/lib/firebase";
const StudentExamSecurityLayout = () => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isMalpracticeDetected, setIsMalpracticeDetected] = useState(false);
  const { authUser,logout } = useAuthStore();
  useEffect(() => {
    /* if (authUser.role == "student") {
      const handleFocusLoss = () => {
        handleMalpractice();
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          handleFocusLoss();
        }
      };

      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          handleFocusLoss();
        }
      };

      const handleRightClick = (event) => event.preventDefault(); // Disable right-click

      window.addEventListener("blur", handleFocusLoss); // Detect switching windows
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("contextmenu", handleRightClick); // Disable right-click

      return () => {
        window.removeEventListener("blur", handleFocusLoss);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener("contextmenu", handleRightClick);
      };
    }else{
        navigate("/");
    } */
    
  }, [navigate]); 

  // Hide cursor after inactivity
  useEffect(() => {
    let timeout;
    const hideCursor = () => setShowCursor(false);
    const resetCursor = () => {
      setShowCursor(true);
      clearTimeout(timeout);
      timeout = setTimeout(hideCursor, 3000); // Hide cursor after 3 sec of inactivity
    };

    document.addEventListener("mousemove", resetCursor);
    timeout = setTimeout(hideCursor, 3000);

    return () => {
      document.removeEventListener("mousemove", resetCursor);
      clearTimeout(timeout);
    };
  }, []);


  

  const handleCloseModal = () => {
    setIsMalpracticeDetected(false);
    navigate("/assessment/s");
  };
  return (
    <div className="w-full h-screen flex bg-gray-100">
      
        <>
          <MalpracticeWarning
            isOpen={isMalpracticeDetected}
            onClose={handleCloseModal}
          />

          {/* Sidebar */}
          <div className="w-1/5 h-full  text-gray-800 flex flex-col p-4 bg-gray-50">
            {/* User Profile */}

            <div className="flex items-center space-x-3 p-4 border-b border-gray-600">
              <img
                src={authUser.photoURL || "/default-avatar.png"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border border-gray-400"
              />
              <div>
                <h1 className="text-lg font-semibold">{authUser.fullName}</h1>
                <p className="text-sm text-gray-700">{authUser.email}</p>
                <span className="text-xs font-medium text-gray-500 capitalize">
                  {authUser.role}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col mt-4 gap-2 space-y-2 bg-gray-50 border border-gray-100">
              
              
              <button
                onClick={() => navigate("/assessment/s/view")}
                className="py-5 px-4 rounded bg-gray-100 hover:bg-gray-200"
              >
                ✏️ Your Assessments
              </button>
              <button
                onClick={() => navigate("/assessment/scoreboard")}
                className="py-5 px-4 rounded bg-gray-100 hover:bg-gray-200"
              >
                📊 Your Performance
              </button>
              <button
                onClick={() => logout()}
                className="py-5 px-4 rounded bg-gray-100 hover:bg-gray-200"
              >
                Logout
              </button>
              
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="w-4/5 h-full overflow-auto bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-700">
                Digi-Classroom Online Examination Portal
              </h1>
              <button
                onClick={() => navigate(-1)}
                className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded"
              >
                ⬅ Back
              </button>
            </div>

            {/* Dynamic Content */}
            <Outlet />
          </div>
        </>
      
    </div>
  );
};

export default StudentExamSecurityLayout;
