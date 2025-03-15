import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-slice";
import toast from "react-hot-toast";

const ScoreBoard = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [grades, setGrades] = useState([]); // Stores grades for the selected assessment
  const { idToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("/assess/view", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (response.status === 200) {
          setAssessments(response.data.assessment);
        }
      } catch (error) {
        toast.error("Failed to fetch assessments.");
      }
    };
    fetchAssessments();
  }, [idToken]);

  const handleSelectAssessment = async (assessmentId) => {
    try {
      // Fetch grades for the selected assessment
      const { data } = await axiosInstance.get(`/assess/grades/a/${assessmentId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setGrades(data); // Set grades in the state
      setSelectedAssessment(assessmentId); // Set the selected assessment
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to fetch grades for the selected assessment.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Scoreboard</h1>

      {/* Show Assessments if None Selected */}
      {!selectedAssessment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessments.map((assessment) => (
           <Card
           key={assessment._id}
           className="cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] rounded-xl shadow-lg overflow-hidden"
           onClick={() => handleSelectAssessment(assessment._id)}
         >
           <CardHeader className="p-5 text-center bg-white rounded-t-xl">
             <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
               {assessment.title}
             </h2>
           </CardHeader>
           <CardContent className="p-5 bg-white text-black">
             <p className="text-sm text-gray-700">{assessment.description}</p>
             <p className="text-xs text-gray-500 mt-2">Click to view the scoreboard</p>
           </CardContent>
         </Card>
         ))}
        </div>
      ) : (
        <>
          {/* Back Button */}
          <Button variant="outline" className="mb-4" onClick={() => setSelectedAssessment(null)}>
            ⬅ Back to Assessments
          </Button>

          {/* Scoreboard for the Selected Assessment */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-gray-100 text-black rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">MCQ Score</th>
                  <th className="px-4 py-2 text-left">Paragraph Score</th>
                  <th className="px-4 py-2 text-left">Total Score</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade._id}>
                    <td className="px-4 py-2">{grade.userId?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-2">{grade.mcqScore}</td>
                    <td className="px-4 py-2">{grade.manualScore}</td>
                    <td className="px-4 py-2">{grade.totalScore}</td>
                    <td className="px-4 py-2">{grade.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ScoreBoard;




/* import { axiosInstance } from '@/lib/axios';


import React, { useEffect, useState } from 'react';

const Scoreboard = () => {

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch scores from the backend based on the assessment ID
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axiosInstance.get(`/assess/grades/a/${assessmentId}`);
        const data = await response.json();
        setScores(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setLoading(false);
      }
    };
    fetchScores();
  }, [assessmentId]);

  // Table rows for the scores
  const renderScoreboard = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-4">Loading...</td>
        </tr>
      );
    }

    return scores.map((score) => (
      <tr key={score.studentId} className="border-b hover:bg-gray-700">
        <td className="py-2 px-4 text-white">{score.studentName}</td>
        <td className="py-2 px-4 text-white">{score.score}</td>
        <td className="py-2 px-4 text-white">{score.timeTaken} min</td>
        <td className="py-2 px-4 text-white">{score.status}</td>
        <td className="py-2 px-4 text-white">{score.submissionDate}</td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Scoreboard</h2>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Student</th>
            <th className="py-3 px-4 text-left">Score</th>
            <th className="py-3 px-4 text-left">Time Taken</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Submission Date</th>
          </tr>
        </thead>
        <tbody>{renderScoreboard()}</tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
 */