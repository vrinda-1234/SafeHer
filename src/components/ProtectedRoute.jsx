import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔥 while checking auth (important on refresh)
  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  // 🔥 if not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 if logged in → allow access
  return children;
};

export default ProtectedRoute;
