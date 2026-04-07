import React, { createContext, useState, useContext, useEffect } from "react";
import { adminDashboard } from "../api/authApi";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const res = await adminDashboard();
            if (res && res.admin) {
                setUser(res.admin);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchDashboard();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchDashboard }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
