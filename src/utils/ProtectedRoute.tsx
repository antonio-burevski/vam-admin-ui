import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuthService} from "../api/authApi.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    // const [cookies] = useCookies(["token"]);
    const {isAuthenticated} = useAuthService();

    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page with state containing the current location
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <>{children}</>; // Allow access to protected content if authenticated
};

export default ProtectedRoute;
