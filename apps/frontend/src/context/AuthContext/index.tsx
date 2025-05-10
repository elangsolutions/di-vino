// context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (token) setIsAuthenticated(true);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("jwt_token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};
