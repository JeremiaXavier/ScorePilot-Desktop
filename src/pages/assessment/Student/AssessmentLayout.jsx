import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../../assets/image.png";
import MalpracticeWarning from "@/components/assessment/Malpracticewarning";
import { useAuthStore } from "@/store/auth-slice";

const StudentExamSecurityLayout = () => {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(true);
  const [isMalpracticeDetected, setIsMalpracticeDetected] = useState(false);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser?.isSuspended) {
      setIsMalpracticeDetected(true);
    }
  }, [authUser?.isSuspended]);

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
    if (window.electron) {
      window.electron.exitApp(); // Exit Electron App
    } else {
      navigate(-1); // Navigate back in browser mode
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-1/5 h-full bg-gray-900/70 backdrop-blur-lg shadow-xl border-r border-gray-800 flex flex-col justify-between p-6">
        <div>
          <div className="flex justify-center mt-8 px-4">
            <img
              src={logo}
              alt="App Logo"
              className="w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
          <nav className="mt-10 space-y-4">
            <button
              onClick={() => navigate("/assessment/s/view")}
              className="flex items-center py-3 px-5 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all duration-300 shadow-md w-full"
            >
              ✏️ <span className="ml-3 font-medium">Your Assessments</span>
            </button>
            <button
              onClick={() => navigate("/assessment/s/scoreboard")}
              className="flex items-center py-3 px-5 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all duration-300 shadow-md w-full"
            >
              📊 <span className="ml-3 font-medium">Your Performance</span>
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-800/50 shadow-md rounded-lg border border-gray-700">
          <img
            src={authUser.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            referrerPolicy="no-referer"
            className="w-14 h-14 rounded-full border-2 border-gray-500 transition-transform duration-300 hover:scale-105"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-300">
              {authUser.fullName}
            </h1>
            <p className="text-sm text-gray-400">{authUser.email}</p>
            <span className="text-xs font-medium text-gray-500 capitalize">
              {authUser.role}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-4/5 h-full bg-gray-900 p-8">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => {
              if (window.electron) {
                window.electron.exitApp(); // Exit Electron App
              } else {
                navigate(-1); // Navigate back in browser mode
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md flex items-center"
          >
             <span className="ml-2">Exit</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <section className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <Outlet />
        </section>
      </main>

      {/* Malpractice Warning Modal */}
      <MalpracticeWarning
        isOpen={isMalpracticeDetected}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default StudentExamSecurityLayout;
