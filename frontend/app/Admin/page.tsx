"use client";

import { useUser } from "../context/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const { user } = useUser();
    const router = useRouter();

    const [productsCount, setProductsCount] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0);

    // Fetch details
    const getDetails = async () => {
        try {
            const token = localStorage.getItem("token") || "";

            // Call both APIs in parallel
            const [productsRes, messagesRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            // Update state with counts
            setProductsCount(productsRes.data.length);
            setMessagesCount(messagesRes.data.length);
        } catch (error) {
            console.log("Error fetching details:", error);
            setProductsCount(0);
            setMessagesCount(0);
        }
    };

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.push("/login");
        } else {
            getDetails(); // call only if user is admin
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user.username}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-yellow-500">
                    <h2 className="text-xl font-semibold">Total Products</h2>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{productsCount}</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-[#37888F]">
                    <h2 className="text-xl font-semibold">Total Orders</h2>
                    <p className="text-3xl font-bold text-[#37888F] mt-2">120</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-[#AB315A]">
                    <h2 className="text-xl font-semibold">Messages</h2>
                    <p className="text-3xl font-bold text-[#AB315A] mt-2">{messagesCount}</p>
                </div>
            </div>
        </div>
    );
}