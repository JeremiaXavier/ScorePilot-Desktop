import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { auth } from "./lib/firebase.js";
import { axiosInstance } from "./lib/axios.js";
import { useAuthStore } from "./store/auth-slice/index.js";

// Authentication Components
import CheckAuth from "./components/auth/CheckAuth.jsx";
import AuthLogin from "./pages/auth/LoginPage";
import AuthRegister from "./pages/auth/RegisterUser";

// Assessment Components
import LandingPage from "./pages/assessment/WelcomePage.jsx";
import StudentExamSecurityLayout from "./pages/assessment/Student/AssessmentLayout.jsx";
import StudentAssessments from "./pages/assessment/Student/ViewAssessments.jsx";
import ExaminationPage from "./pages/assessment/Student/Examination/ExaminationLayout.jsx";
import WelcomeScreen from "./pages/assessment/WelcomeScreen.jsx";
import ScoreBoard from "./pages/assessment/ScoreBoard.jsx";

function App() {
  const { authUser, isAuthenticated, set } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        try {
          const res = await axiosInstance.get("/auth/check", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ authUser: res.data, isAuthenticated: true, idToken: token });
        } catch (error) {
          console.error("Error checking auth:", error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, isAuthenticated, set]);

  /* if (isLoading && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
 */
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Toaster position="top-right" />

      <Routes>
        {/* Authentication Routes */}
        <Route path="/splash" element={<WelcomeScreen />} />
        <Route path="signin" element={isAuthenticated ? <Navigate to="/" /> : <AuthLogin />} />
        <Route path="signup" element={isAuthenticated ? <Navigate to="/" /> : <AuthRegister />} />
        <Route path="/" element={<CheckAuth />} />

        {/* Teacher Routes */}
      \
        {/* Student Routes */}
        <Route path="assessment/s"  element={isAuthenticated ? <StudentExamSecurityLayout /> : <Navigate to="/signin" /> }>
          <Route path="" element={<LandingPage />} />
          <Route path="view" element={<StudentAssessments />} />
          <Route path="scoreboard" element={<ScoreBoard />} />
        </Route>

        {/* Exam Page */}
        <Route path="assessment/s/start/:id" element={<ExaminationPage />} />
      </Routes>
    </div>
  );
}

export default App;
