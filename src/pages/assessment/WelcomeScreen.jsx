import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card"; // ShadCN Card
import { Loader2, CheckCircle } from "lucide-react"; // Icons for status
import logo from "@/assets/logo.png"; // Your company logo
import appIcon from "@/assets/image.png"; // App name/logo icon
import wallpaper from "@/assets/splash.jpg"; // New background wallpaper
import { axiosInstance } from "@/lib/axios"; // Ensure axios is configured

const WelcomeScreen = () => {
  const [status, setStatus] = useState("Checking server connectivity...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        setStatus("Connecting to server...");
        await axiosInstance.get("/health"); // API health check

        setStatus("Server connected successfully ✅");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

        setStatus("Loading resources...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

        setStatus("Initialization complete! Redirecting...");
        setLoading(false);

        setTimeout(() => {
          window.location.href = "/"; // Redirect after 1.5s
        }, 1500);
      } catch (error) {
        setStatus("❌ Server connection failed. Retrying...");
        setTimeout(checkServer, 3000); // Retry after 3 sec
      }
    };

    checkServer();
  }, []);

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-gray-900"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay for Better Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Main Card with Glass Effect */}
      <Card
        className="relative w-[420px] p-2 shadow-2xl border border-white/20 rounded-xl"
        style={{
          background: "rgba(255, 255, 255, 0.01)", // Transparent glass effect
          backdropFilter: "blur(12px)", // Blurred background
          WebkitBackdropFilter: "blur(12px)", // Safari support
        }}
      >
        <CardContent className="flex flex-col items-center py-8 space-y-6">
          {/* App Name & "Powered by" (Top-Left) */}
          <div className="relative top-6 left-2 text-left">
            <div className="flex items-center space-x-3">
              <img src={appIcon} alt="App Icon" className="h-20" />
            
            </div>
            <p className="text-gray-300 text-sm mt-2">Powered by</p>
            <h2 className="text-lg font-extrabold text-white">Digi-Classroom</h2>
          </div>

          {/* Status Updates */}
{/*           <p className="text-white text-sm font-medium mt-6">{status}</p>
 */}
          {/* Loading Indicator */}
          {loading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <CheckCircle className="w-8 h-8 text-green-400" />
          )}
        </CardContent>
      </Card>

      {/* Company Logo (Bottom-Left) - Larger Size & Proper Margins */}
      <div className="absolute bottom-6 left-6">
        <img src={logo} alt="Company Logo" className="w-40 opacity-90" />
      </div>
    </div>
  );
};

export default WelcomeScreen;
