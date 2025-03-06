import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-slice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { LogIn } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
const AuthLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLogginIn, googleLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  /* const validateInput = ()=>{

  }  */ /* for validating the form */

  const onSubmit = async (e) => {
    e.preventDefault();
    if (await login(formData)) navigate("/");
  };
  const onGoogleLogin = async () => {
    if (await googleLogin()) navigate("/");
  };
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-grow">
        {/* Left column */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-white">
          <div className="flex flex-col text-center text-black-600">
            {/* Placeholder for classroom design */}
{/*             <img src={samplelogo} alt="" />
 */}            <p className="text-4xl font-semibold font-serif"> Digi-Classroom</p>
            <p className="text-sm">Learn, Explore, and Grow</p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h1>
              <p className="mt-2">
                Don t have an account
                <Link
                  className="font-medium text-primary hover:underline "
                  to="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-3">
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
                  {isLogginIn ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={onGoogleLogin}
            >       <LogIn className="w-5 h-5 mr-2" />

              Login with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
