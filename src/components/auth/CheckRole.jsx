import { Navigate, useLocation } from "react-router-dom";

function CheckRole({ isAuthenticated, user, children }) {
  const location = useLocation();
  
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/signin") ||
      
      location.pathname.includes("/signup")
    )
  ) {
    return <Navigate to="/signin" />;
  }
  
 
  if (
    isAuthenticated &&
    user?.role === "teacher" &&
    location.pathname.includes("/student")
  ) {
    return <Navigate to={"/teacher/dashboard"} />;
  }

  if (
    isAuthenticated &&
    user?.role === "student" &&
    location.pathname.includes("/teacher")
  ) {
    return <Navigate to="/student/dashboard" />;
  }
  return <>{children}</>;
}

export default CheckRole;
