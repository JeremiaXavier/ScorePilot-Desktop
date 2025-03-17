import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-slice";
import toast from "react-hot-toast";

const SUSPENSION_THRESHOLD = 3; // Customize the threshold

export default function SecurityLayout({ testId, userId, children }) {
  const [violationCount, setViolationCount] = useState(0);
  const [isSuspended, setIsSuspended] = useState(false);
  const { idToken } = useAuthStore();
  // Log malpractice to backend
  const logMalpractice = async (violationType) => {
    try {
      const res = await axiosInstance.post(
        "/assess/log",
        { userId, testId, violationType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (res.data.isSuspended) {
        deleteSavedAnswers();
        setIsSuspended(true);
         // Call API to delete answers
      } else {
        setViolationCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to log malpractice:", error);
    }
  };

  // API to delete saved answers when suspended
  const deleteSavedAnswers = async () => {
    try {
      await axiosInstance.delete(`/assess/delete-answers/${userId}/${testId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      toast.error("All answers are deleted and you are suspended from examination");
    } catch (error) {
      
      console.error("Failed to delete saved answers:", error);
    }
  };

  // Disable right-click and shortcuts
  const preventCheatingKeys = (e) => {
    if (e.key === "F12" || e.key === "Escape") {
      e.preventDefault();
      toast.error("malpractice detected");
      logMalpractice("Shortcut Key Press");
    } else if (e.metaKey) {
      // Log malpractice when the Meta (Windows) key is pressed
      toast.error("Malpractice detected!");
      logMalpractice("Meta (Windows) Key Press");
    }
  };
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", preventCheatingKeys);

    return () => {
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("keydown", preventCheatingKeys);
    };
  }, []);

  return (
    <>
      {children}

      {/* Suspension Warning Modal */}
      {isSuspended && (
        <Dialog open={isSuspended}>
          <DialogContent className="text-center bg-red-900 text-white border-red-700 shadow-lg">
            <DialogTitle className="text-3xl font-bold text-red-300">
              ⚠️ CHEATING DETECTED! ⚠️
            </DialogTitle>
            <p className="text-lg font-semibold mt-2">
              Your exam session has been terminated due to multiple violations.
            </p>
            <p className="text-md mt-2 text-red-200">
              All your answers have been deleted. This action has been reported.
            </p>
            <p className="mt-4 text-xl font-bold text-yellow-300 animate-pulse">
              You are permanently suspended from this test.
            </p>
            <Button
              onClick={() => {
                if (window.electron) {
                  window.electron.exitApp(); // Exit Electron App
                }
              }}
              variant="destructive"
              className="mt-6 text-lg"
            >
              EXIT NOW
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
