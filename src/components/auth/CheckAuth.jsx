import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase.js";
import { useAuthStore } from "../../store/auth-slice";
import toast from "react-hot-toast";
import { sendEmailVerification } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { axiosInstance } from "../../lib/axios";
import { Button } from "../ui/button";

export default function CheckAuth() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { authUser, isAuthenticated, set,logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        try {
          const res = await axiosInstance.get("/auth/check", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ authUser: res.data, isAuthenticated: true,idToken:token });
          setIsLoading(false);

          if (authUser?.role != null) {
            if (authUser.role === "student") {
              navigate("/assessment/s");
            } else if (authUser.role === "teacher") {
              logout();
            }
          } else {
            setIsModalOpen(true); // Show modal if no role is assigned
          }
        } catch (error) {
          // Handle errors from the backend (e.g., network issues, etc.)
          console.error("Error checking auth:", error);
        }
      } else {
        setIsLoading(false);
        if (!isAuthenticated) navigate("signin");
      }
    });

    return () => {
      unsubscribe(); // Cleanup listener when component unmounts
    };
  }, [navigate, isAuthenticated, set]);

 /*  useEffect(() => {
    if (!isLoading && auth.currentUser && !auth.currentUser.emailVerified) {
      // If user is authenticated and email is not verified
      setIsVerifyModalOpen(true);
      console.log("second useeffect");
    }
  }, [isLoading]); */

  const handleResendVerificationEmail = () => {
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          console.log("Verification email sent.");
          toast.success("Verification email sent!");
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          toast.error("Failed to send verification email.");
        });
    }
  };

  const handleRoleSelection = async () => {
    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }

    try {
      const user = auth?.currentUser;
      const token = await user.getIdToken();
      const uid = user.uid;
      await axiosInstance.patch(
        "/auth/update-role",
        { uid, role },
        {
          headers: {
            Authorization: `Bearer ${token}`, // The idToken from signup
          },
        }
      );
      toast.success("Role updated successfully!");
      setIsModalOpen(false);
      if (role === "student") navigate("/student/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
    } catch (error) {
      toast.error(
        "Error updating role.",
        error.response?.data?.message || "Unknown error"
      );
    }
  };

  console.log("checking IM in checkauth");
  return (
    <div>
      {/* Show loading spinner if isLoading is true */}
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-screen">
          {/* Tailwind spinner */}
          <div className="w-12 h-12 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
        </div>
      ) : (
        <>
          {authUser && !authUser.role && (
            <Dialog open={isModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Your Role</DialogTitle>
                  <DialogDescription>
                    Please select your role and accept the terms to proceed.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Role Selection Dropdown */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="role" className="text-right">
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="col-span-3 p-2 border rounded-md"
                    >
                      <option value="">Select a role</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="terms" className="text-sm">
                      I accept the{" "}
                      <span className="text-blue-600 cursor-pointer">
                        terms and conditions
                      </span>
                      .
                    </label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleRoleSelection}
                    disabled={!role || !termsAccepted}
                    className="w-full"
                  >
                    Update Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {isVerifyModalOpen && (
            <Dialog open={isVerifyModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Email Verification</DialogTitle>
                  <DialogDescription>
                    Please verify your email address to continue.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={handleResendVerificationEmail}>
                    Resend Verification Email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
         
        </>
      )}
    </div>
  );
}
