/* eslint-disable @typescript-eslint/no-explicit-any */
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import axiosInstance from "./axiosInstance";
import {useState} from "react";

export const useAuthService = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]); // Access token from cookies
    const navigate = useNavigate();

    // Check if the user is already logged in
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!cookies.token);

    // Register method (Initial Step: Sends OTP)
    const register = async (
        username: string,
        email: string,
        password: string
    ) => {
        try {
            // No need for token here, as the route is public
            const response = await axiosInstance.post("/core/register/", {
                username,
                email,
                password,
            });

            console.log("Registration successful, verify OTP");
            return {success: true, message: response.data.message};
        } catch (error: any) {
            console.error(
                "Registration failed:",
                error.response?.data?.message || error.message
            );
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    // OTP Verification Method
    const verifyOtp = async (email: string, otp: string) => {
        try {
            // No need for token here, as the route is public
            const response = await axiosInstance.post("/core/verify-otp/", {
                email,
                otp,
            });

            // Set the token in cookies upon successful OTP verification
            const expires = new Date();
            expires.setDate(expires.getDate() + 7); // Set cookie expiration date to 7 days from now

            setCookie("token", response.data.token, {
                path: "/login",
                expires,
                secure: true,
                sameSite: "strict",
            });

            // Redirect to the homepage or dashboard
            navigate("/");

            return {success: true, message: "Account activated successfully"};
        } catch (error: any) {
            console.error(
                "OTP verification failed:",
                error.response?.data?.message || error.message
            );
            return {
                success: false,
                message: error.response?.data?.message || "Invalid OTP",
            };
        }
    };

    // Login method
    const login = async (username: string, password: string) => {
        // Define routes where login should not be triggered
        const excludedRoutes = ['/register', '/login', '/some-other-route'];

        // Check if the current route is in the excludedRoutes array
        if (excludedRoutes.includes(window.location.pathname)) {
            console.log("Login not allowed on this route:", window.location.pathname);
            return false; // Skip login logic if on excluded route
        }

        try {
            const response = await axiosInstance.post("/core/login/", {
                username,
                password,
            });

            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;

            if (accessToken) {
                setIsAuthenticated(true);

                // Store the access token in a regular cookie
                const expires = new Date();
                expires.setDate(expires.getDate() + 7); // Set expiration for the access token
                setCookie("token", accessToken, {
                    path: "/",
                    expires,
                    secure: true,
                    sameSite: "strict",
                });

                // Store the refresh token in an HTTP-only cookie (set this server-side, if needed)
                document.cookie = `refresh_token=${refreshToken}; path=/; expires=${expires.toUTCString()}; secure; HttpOnly; SameSite=Strict`;

                return true; // Indicate login was successful
            }

            setIsAuthenticated(false);
            return false; // If no token in response, return false
        } catch (error) {
            setIsAuthenticated(false);
            console.error("Login failed:", error);
            return false;
        }
    };

    // Logout method
    const logout = () => {
        removeCookie("token", {path: "/"});
        setIsAuthenticated(false);
        navigate("/login"); // Redirect to login page after logout
    };

    // Get user profile (requires authentication)
    const getUserProfile = async () => {
        try {
            // Only authenticated requests
            const response = await axiosInstance.get("/core/user-profile/");
            return {success: true, data: response.data};
        } catch (error: any) {
            console.error("Failed to fetch user profile:", error);
            return {success: false, message: "Failed to fetch user profile"};
        }
    };

    // Expose the authentication methods
    return {
        register,
        verifyOtp, // Add OTP verification method
        login,
        logout,
        getUserProfile, // Add profile method
        isAuthenticated,
        setIsAuthenticated
    };
};
