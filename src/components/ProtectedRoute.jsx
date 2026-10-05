import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-[#1cd8d2]">
        <div className="w-8 h-8 rounded-full border-2 border-[#1cd8d2] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to secret admin login
    return <Navigate to="/kundan-secret-portal/login" state={{ from: location }} replace />;
  }

  return children;
}
