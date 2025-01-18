import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [cookies] = useCookies(["token"]);
  const isAuthenticated = !!cookies.token; // Check if the token exists

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
