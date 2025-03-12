import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Use Django server's local IP
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the token to the Authorization header for protected routes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.split("=")[1]}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (token expired or invalid) and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Remove token from cookies
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
