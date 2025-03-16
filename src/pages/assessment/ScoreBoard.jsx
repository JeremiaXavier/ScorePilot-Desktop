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
} from "recharts";
import { ThemeProvider, useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ScoreboardDashboard = () => {
  const { idToken, authUser } = useAuthStore();
  const [scoreData, setScoreData] = useState([]);
  const { theme } = useTheme(); // Get current theme
  const userId = authUser._id;

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axiosInstance.get(`/assess/scoreboard/${userId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setScoreData(response.data);
      } catch (error) {
        console.error("Failed to load scoreboard:", error);
      }
    };

    fetchScores();
  }, [idToken]);

  if (scoreData.length === 0) return <p className="text-gray-400">Loading...</p>;

  // 🎯 Data Formatting
  const radarData = scoreData.map((exam) => ({
    subject: exam.examTitle,
    score: exam.totalScore,
  }));

  const pieData = [
    { name: "Correct", value: scoreData.reduce((acc, e) => acc + e.correctAnswers, 0) },
    { name: "Incorrect", value: scoreData.reduce((acc, e) => acc + e.incorrectAnswers, 0) },
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
  const gridColor = theme === "dark" ? "#555" : "#ddd";
  const axisColor = theme === "dark" ? "#ddd" : "#333";
  const lineStrokeColor = theme === "dark" ? "#4A90E2" : "#2196F3";
  const barFillColor = theme === "dark" ? "#9575CD" : "#673AB7";

  return (
    <ThemeProvider attribute="class">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* 📊 Radar Chart - Performance Overview */}
        <Card className="bg-white shadow-lg dark:bg-gray-950 dark:text-white">
          <CardHeader>
            <CardTitle>📈 Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" stroke={axisColor} />
                <Radar name="Score" dataKey="score" stroke={lineStrokeColor} fill={lineStrokeColor} fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🍩 Pie Chart - MCQ Accuracy */}
        <Card className="bg-white shadow-lg dark:bg-gray-950 dark:text-white">
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
        <Card className="bg-white shadow-lg dark:bg-gray-950 dark:text-white">
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
                <Line type="monotone" dataKey="score" stroke={lineStrokeColor} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📊 Bar Chart - Score by Subject */}
        <Card className="bg-white shadow-lg dark:bg-gray-950 dark:text-white">
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
    </ThemeProvider>
  );
};

export default ScoreboardDashboard;
