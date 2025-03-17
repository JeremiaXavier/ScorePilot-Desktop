import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-slice";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  PolarRadiusAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ScoreboardDashboard = () => {
  const { idToken, authUser } = useAuthStore();
  const [scoreData, setScoreData] = useState([]);
  const userId = authUser._id;

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axiosInstance.get(
          `/assess/scoreboard/${userId}`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        setScoreData(response.data);
      } catch (error) {
        console.error("Failed to load scoreboard:", error);
      }
    };

    fetchScores();
  }, [idToken]);

  if (scoreData.length === 0)
    return <p className="text-gray-400">No data.....</p>;

  // 🎯 Data Formatting
 const radarData = scoreData.map((exam) => ({
    subject: exam.examTitle,
    score: exam.totalScore,
  })); 

  
  const pieData = [
    {
      name: "Correct",
      value: scoreData.reduce((acc, e) => acc + e.correctAnswers, 0),
    },
    {
      name: "Incorrect",
      value: scoreData.reduce((acc, e) => acc + e.incorrectAnswers, 0),
    },
  ];

  const lineData = scoreData.map((exam) => ({
    name: new Date(exam.examDate).toLocaleDateString(),
    score: exam.totalScore,
  }));

  const barData = scoreData.map((exam) => ({
    name: exam.examTitle,
    score: exam.totalScore,
  }));

  const colors = ["#4CAF50", "#F44336"]; // Green & Red

  // 🎨 Adjust chart colors dynamically
  const gridColor = "#fff"; /* : "#ddd"; */
  const axisColor = "#fff"; /* : "#333"; */
  const lineStrokeColor = "#f8f8f8";
  /* : "#2196F3";
   */ const barFillColor = "#9575CD"; /* : "#673AB7"; */

  return (
    <>
      <Card className=" shadow-lg bg-gray-950 text-white">
        <CardHeader>
          <CardTitle>📋 Exam Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto ">
            <table className="w-full text-left border  border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 border">Exam Title</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Total Score</th>
                  <th className="p-2 border">Correct Answers</th>
                  <th className="p-2 border">Incorrect Answers</th>
                </tr>
              </thead>
              <tbody>
                {scoreData.map((exam, index) => (
                  <tr key={index} className="border">
                    <td className="p-2 border">{exam.examTitle}</td>
                    <td className="p-2 border">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">{exam.totalScore}</td>
                    <td className="p-2 border">{exam.correctAnswers}</td>
                    <td className="p-2 border">{exam.incorrectAnswers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* 📊 Radar Chart - Performance Overview */}
        <Card className="shadow-lg bg-gray-950 text-white">
          <CardHeader>
            <CardTitle>📈 Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid
                  stroke="rgba(255, 255, 255, 0.4)"
                  radialLines={true}
                />
                <PolarAngleAxis dataKey="subject" stroke="#fff" />
                <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.6)" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#00bcd4"
                  fill="#00bcd4"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🍩 Pie Chart - MCQ Accuracy */}
        <Card className=" shadow-lg bg-gray-950 text-white">
          <CardHeader>
            <CardTitle>✔️ MCQ Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={100}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📈 Line Chart - Exam Score Trend */}
        <Card className=" shadow-lg bg-gray-950 text-white">
          <CardHeader>
            <CardTitle>📊 Exam Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={lineStrokeColor}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📊 Bar Chart - Score by Subject */}
        <Card className=" shadow-lg bg-gray-950 text-white">
          <CardHeader>
            <CardTitle>📚 Score by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Bar dataKey="score" fill={barFillColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ScoreboardDashboard;
