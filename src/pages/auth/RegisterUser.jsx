import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-slice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AuthRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp, googleSignup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = () => {
    if (!formData.fullName.trim()) return toast.error("Fullname required");
    if (!formData.email.trim()) {
      toast.error("Email is required");
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(formData.email)
    ) {
      toast.error("Invalid email format");
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
    } else if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
    }

    if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
    return true;
  }; /* for validating the form */

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = validateInput();
    if (success === true) {
      const response = await signup(formData);
      if (response) {
        toast.success("user is signed up successfully");
        navigate('/');
      }
    }
  }; 
   

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-grow">
        {/* Left column */}
       <div className="hidden md:flex flex-1 items-center justify-center bg-white">
                 <div className="flex flex-col text-center text-black-600">
                   {/* Placeholder for classroom design */}
                   {/* <img src={} alt="" /> */}
                   <p className="text-4xl font-semibold font-serif"> Digi-Classroom</p>
                   <p className="text-sm">Learn, Explore, and Grow</p>
                 </div>
               </div>

        {/* Right column */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 shadow rounded-lg">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Create new Account
              </h1>
              <p className="mt-2">
                Already have an account?
                <Link
                  className="font-medium text-primary hover:underline"
                  to="/signin"
                >
                  Login
                </Link>
              </p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-3">
                <Label className="mb-1">User Name</Label>
                <Input
                  name="fullName"
                  placeholder="Enter your username"
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      fullName: event.target.value,
                    })
                  }
                />

                <Label className="mb-1">Email</Label>
                <Input
                  name="email"
                  placeholder="Enter your Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      email: event.target.value,
                    })
                  }
                />

                <Label className="mb-1">Password</Label>
                <div className="relative flex items-center">
                  <Input
                    name="password"
                    placeholder="Enter your password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        password: event.target.value,
                      })
                    }
                    className="pr-10" // Leave space for the icon
                  />
                  <button
                    type="button"
                    className="absolute right-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <Button type="submit" className="mt-2 w-full">
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={googleSignup}
            >
              Sign up with Google
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AuthRegister;
