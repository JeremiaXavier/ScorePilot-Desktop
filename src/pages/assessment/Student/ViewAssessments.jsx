import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const { idToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("/assess/s/view", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setAssessments(response.data.assessments);
      } catch (error) {
        toast.error("Failed to load assessments");
      }
    };

    fetchAssessments();
  }, [idToken]);

  const handleStartExam = (assessment) => {
    console.log("🟢 Start Exam Clicked:", assessment._id);

    if (window.electron && window.electron.toggleFullscreen) {
      console.log("📢 Switching to Fullscreen Mode...");
      window.electron.toggleFullscreen(true);
    } else {
      console.error("❌ Electron API not available!");
    }

    navigate(`/assessment/s/start/${assessment._id}`);
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 flex items-center">
        📖 Your Assigned Assessments
      </h1>

      {assessments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card
              key={assessment._id}
              className="bg-gray-900 shadow-lg border border-gray-800 rounded-xl hover:scale-105 transition-transform duration-300"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-green-400">
                  <BookOpen className="w-5 h-5 mr-2" /> {assessment.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-2" /> Created on:{" "}
                  {new Date(assessment.createdAt).toLocaleDateString()}
                </p>

                {assessment.answerSubmitted ? (
                  <div className="mt-4 flex justify-center items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                    <CheckCircle className="w-5 h-5 mr-2" /> Submitted
                  </div>
                ) : (
                  <Button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition-all"
                    onClick={() => handleStartExam(assessment)}
                  >
                    Start Exam
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-lg mt-10">
          No assessments assigned yet.
        </p>
      )}
    </div>
  );
};

export default StudentAssessments;
