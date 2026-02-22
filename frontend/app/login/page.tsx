"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "../context/page";

export default function LoginPage() {
    const router = useRouter();

    const { login } = useUser()


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            // Save token
            localStorage.setItem("token", data.token);

            // Save user in context
            login({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                role: data.user.role,
            });

            router.push("/Admin");

        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">
                    Login to Poshak Fabrics
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-yellow-600 font-semibold">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}