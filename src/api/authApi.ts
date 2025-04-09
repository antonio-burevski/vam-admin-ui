/* eslint-disable @typescript-eslint/no-explicit-any */
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import axiosInstance, {axiosPublicInstance, fetchCsrfToken} from "./axiosInstance";
import {useState} from "react";
import {extractErrorMessage} from "../utils/coreUtils.ts";

export const useAuthService = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!cookies.token);

    // Helper function to store tokens
    const storeTokens = (accessToken: string, refreshToken: string) => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days expiration

        setCookie("token", accessToken, {
            path: "/",
            expires,
            secure: true,
            sameSite: "strict",
        });

        document.cookie = `refresh_token=${refreshToken}; path=/; expires=${expires.toUTCString()}; secure; SameSite=Strict`;
    };

    // 🔹 Register User (Public Route)
    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axiosPublicInstance.post("/core/register/", {
                username,
                email,
                password,
            });
            console.log("Registration successful, verify OTP");
            return {success: true, message: response.data.message};
        } catch (error: any) {
            const message =
                extractErrorMessage(error.response?.data) || error.message;
            console.error("Registration failed:", message);
            return {success: false, message};
        }
    };

    // 🔹 Verify OTP (Public Route)
    const verifyOtp = async (email: string, otp: string) => {
        try {
            await axiosInstance.post("/core/verify-otp/", {email, otp});

            // ✅ No token storage, no redirect, only return success
            return {success: true, message: "Account activated successfully"};
        } catch (error: any) {
            console.error("OTP verification failed:", error.response?.data?.message || error.message);
            return {success: false, message: error.response?.data?.message || "Invalid OTP"};
        }
    };

    // 🔹 Login (Stores Tokens)
    const login = async (username: string, password: string) => {
        try {
            const response = await axiosInstance.post("/core/login/", {username, password});

            storeTokens(response.data.access_token, response.data.refresh_token);

            // Fetch new CSRF token after login
            await fetchCsrfToken();

            setIsAuthenticated(true);
            return true;
        } catch (error) {
            setIsAuthenticated(false);
            console.error("Login failed:", error);
            return false;
        }
    };

    // Logout (Clears Tokens)
    const logout = async () => {
        removeCookie("token", {path: "/"});
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        // Fetch new CSRF token after logout to reset session security
        await fetchCsrfToken();

        setIsAuthenticated(false);
        navigate("/login");
    };


    // 🔹 Fetch User Profile (Requires Authentication)
    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get("/core/user-profile/");
            return {success: true, data: response.data};
        } catch (error: any) {
            console.error("Failed to fetch user profile:", error);
            return {success: false, message: "Failed to fetch user profile"};
        }
    };

    // 🔹 Request Permission (Requires Authentication)
    const requestPermission = async (permission_codename: string) => {
        try {
            const response = await axiosInstance.post("/core/request-permission/", {
                permission: permission_codename,
            });

            return {
                success: true,
                status: response.status,
                message: response.data.message,
            };
        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data.error || "An error occurred",
                };
            } else {
                return {
                    success: false,
                    status: 500,
                    message: "Network error, please try again later.",
                };
            }
        }
    };

    return {
        register,
        verifyOtp,
        login,
        logout,
        getUserProfile,
        requestPermission,
        isAuthenticated,
        setIsAuthenticated,
    };
};
