import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login"); // Redirect to login page
        }, 10000); // 10 seconds (10000 ms)

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <h1>Page Not Found</h1>
            <p>You will be redirected to the login page in 10 seconds...</p>
        </div>
    );
};

export default NotFoundPage;
