"use client"

import { createContext, useContext, useState } from "react"


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

    const login = (user: User) => {
        setUser(user)
    }

    const logout = () => {
        setUser(null)
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