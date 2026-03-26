"use client"

import { createContext, useContext, useState, useEffect } from "react"


type User = {
    id: number
    username: string
    email: string
    role: "user" | "admin";
}


type Context = {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

const UserContext = createContext<Context | null>(null)


export default function UserProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from local storage");
                }
            }
        }
    }, []);

    const login = (user: User) => {
        setUser(user)
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }

    const logout = () => {
        setUser(null)
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used inside UserProvider");
    }
    return context;
};