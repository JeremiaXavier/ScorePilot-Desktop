import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../../assets/imagez.png";
import MalpracticeWarning from "@/components/assessment/Malpracticewarning";
import { useAuthStore } from "@/store/auth-slice";

const StudentExamSecurityLayout = () => {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(true);
  const [isMalpracticeDetected, setIsMalpracticeDetected] = useState(false);
  const { authUser } = useAuthStore();

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
      {/* Sidebar */}
      <aside className="w-1/5 h-full bg-white/90 backdrop-blur-lg shadow-md border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          <div className="flex justify-center mt-11 px-10">
            <img src={logo} alt="App Logo" className="" />
          </div>
          <nav className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/assessment/s/view")}
              className="flex items-center py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition shadow-sm w-full"
            >
              ✏️ <span className="ml-3">Your Assessments</span>
            </button>
            <button
              onClick={() => navigate("/assessment/scoreboard")}
              className="flex items-center py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition shadow-sm w-full"
            >
              📊 <span className="ml-3">Your Performance</span>
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-white shadow-sm rounded-lg border">
          <img
            src={authUser.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            className="w-14 h-14 rounded-full border-2 border-gray-400"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {authUser.fullName}
            </h1>
            <p className="text-sm text-gray-600">{authUser.email}</p>
            <span className="text-xs font-medium text-gray-500 capitalize">
              {authUser.role}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-4/5 h-full overflow-auto bg-gradient-to-br from-gray-50 to-white p-8">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg transition shadow-md flex items-center"
          >
            ⬅ <span className="ml-2">Back</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <section className="bg-white p-6 ">
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
