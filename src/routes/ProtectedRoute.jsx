import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  
  const { user, loading } = useAuth();
  console.log("ProtectedRoute user:", user);
  // Wait until Firebase authentication state is determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // User is not authenticated
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;