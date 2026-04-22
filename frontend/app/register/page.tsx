"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/page";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useUser();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

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
                setError(data.msg || "Google Registration failed");
            }
        } catch (err: any) {
            console.error("Google Catch Error:", err);
            setError("Network error or server currently unreachable");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const response = await res.json();
            console.log("response", response);

            if (res.ok) {
                setSuccess(response.msg || "Account created successfully 🎉");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                setError(response.msg || "Registration failed");
            }
        } catch (err: any) {
            console.error("Registration Catch Error:", err);
            setError("Network error or server currently unreachable");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE (Branding) */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-black flex-col justify-center items-center p-10">
                <h1 className="text-5xl font-bold mb-4">Join Poshak</h1>
                <p className="text-lg text-center max-w-md">
                    Create your account and explore premium fashion collections.
                </p>
            </div>

            {/* RIGHT SIDE (Form) */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

                    <h2 className="text-3xl font-bold text-center mb-2">
                        Create Account ✨
                    </h2>
                    <p className="text-center text-gray-500 mb-6 text-sm">
                        Start your journey with us
                    </p>

                    {/* Success */}
                    {success && (
                        <div className="bg-green-100 text-green-700 p-2 rounded-lg text-sm mb-3 text-center">
                            {success}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded-lg text-sm mb-3 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-400 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 rounded-lg hover:scale-105 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Register"}
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
                                setError("Google Registration Failed");
                            }}
                        />
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-center mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-yellow-600 font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}