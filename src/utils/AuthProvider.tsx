import React, {useCallback, useEffect, useState} from "react";
import {useAuthService} from "../api/authApi";
import {IUserProfile} from "./types/api.types.ts";
import {AuthContext} from "../contexts/AuthContext.tsx";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const {getUserProfile, isAuthenticated} = useAuthService();
    const [user, setUser] = useState<IUserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getUser = useCallback(async (): Promise<IUserProfile | null> => {
        if (isAuthenticated && user) return user; // Return cached user if available

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
    }, [isAuthenticated, user, getUserProfile]);

    // Fetch user profile on mount if authenticated
    useEffect(() => {
        const fetchUser = async () => {
            if (isAuthenticated && !user) {
                await getUser();
            }
            setLoading(false);
        };

        fetchUser();
    }, [isAuthenticated, getUser]);

    return (
        <AuthContext.Provider value={{user, error, getUser}}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};
