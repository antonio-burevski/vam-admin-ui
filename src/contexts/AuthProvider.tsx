import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthService } from "../api/authApi";
import { IUserProfile } from "../utils/types/api.types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getUserProfile, isAuthenticated } = useAuthService();
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile only when needed
  const getUser = async (): Promise<IUserProfile | null> => {
    if (!isAuthenticated || user) return user; // Return cached user if available

    try {
      const response = await getUserProfile();
      if (response.success) {
        setUser(response.data);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch user data.");
      }
    } catch (err) {
      setError("Error loading user data.");
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, getUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};
