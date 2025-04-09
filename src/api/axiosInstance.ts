import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

export const axiosPublicInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Function to get cookies by name
const getCookie = (name: string) => {
    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
};

// Function to refresh access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) throw new Error("No refresh token found");

        const response = await axios.post("http://127.0.0.1:8000/core/refresh/", {
            refresh_token: refreshToken,
        });

        // Store the new access token
        document.cookie = `token=${response.data.access_token}; path=/; secure; SameSite=Lax`;

        return response.data.access_token;
    } catch (error) {
        console.error("Refresh token failed", error);
        return null;
    }
};

// Function to fetch CSRF Token
export const fetchCsrfToken = async () => {
    try {
        await axiosInstance.get("/core/csrf-token/"); // Django should return the CSRF cookie
    } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
    }
};

// Attach the token to the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookie("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token expiration (401) by refreshing token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            }
        }

        // If refresh token is invalid or expired, log the user out
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/login";
        return Promise.reject(error);
    }
);

export default axiosInstance;
