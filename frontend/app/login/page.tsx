"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/page";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchUser = async () => {
            if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();

            console.log("data", data);
        }
        fetchUser();
    }, []);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                login({
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email,
                    role: data.user.role,
                });

                if (data.user.role === "admin") {
                    router.push("/Admin");
                } else {
                    router.push("/");
                }
            } else {
                setError(data.msg || "Google Login failed");
            }
        } catch (err: any) {
            console.error("Google Login Catch Error:", err);
            setError("Network error or server currently unreachable");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                login({
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email,
                    role: data.user.role,
                });

                if (data.user.role === "admin") {
                    router.push("/Admin");
                } else {
                    router.push("/");
                }
            } else {
                setError(data.msg || "Login failed");
            }
        } catch (err: any) {
            console.error("Login Catch Error:", err);
            setError("Network error or server currently unreachable");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE (Branding / Image Section) */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-black flex-col justify-center items-center p-10">
                <h1 className="text-5xl font-bold mb-4">Poshak Fabrics</h1>
                <p className="text-lg text-center max-w-md">
                    Premium clothing experience with modern fashion and elegant designs.
                </p>
            </div>

            {/* RIGHT SIDE (Login Form) */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

                    <h2 className="text-3xl font-bold text-center mb-2">
                        Welcome Back 👋
                    </h2>
                    <p className="text-center text-gray-500 mb-6 text-sm">
                        Login to continue
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm mb-4 text-center">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block mb-1 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 rounded-lg hover:scale-105 transition duration-200"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google Login Button */}
                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                setError("Google Login Failed");
                            }}
                        />
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm mt-6">
                        Don’t have an account?{" "}
                        <a
                            href="/register"
                            className="text-yellow-600 font-semibold hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}