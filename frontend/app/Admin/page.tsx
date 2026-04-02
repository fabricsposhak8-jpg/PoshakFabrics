"use client";

import { useUser } from "../context/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const { user } = useUser();
    const router = useRouter();

    const [productsCount, setProductsCount] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);

    // Fetch details
    const getDetails = async () => {
        try {
            const token = localStorage.getItem("token") || "";

            // Call both APIs in parallel
            const [productsRes, ordersRes, messagesRes] = await Promise.all([

                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/admin/get`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }),
            ]);
            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();
            const messagesData = await messagesRes.json();
            // Update state with counts
            setProductsCount(productsData.length);
            setMessagesCount(messagesData.length);
            setOrdersCount(ordersData.order.length);
        } catch (error) {
            console.log("Error fetching details:", error);
            setProductsCount(0);
            setMessagesCount(0);
            setOrdersCount(0);
        }
    };

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.push("/");
        } else {
            getDetails(); // call only if user is admin
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Welcome, {user.username}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Products */}
                <div className="bg-white shadow-md rounded-xl p-5 sm:p-6 border-l-4 border-yellow-500 hover:shadow-lg transition">
                    <h2 className="text-base sm:text-lg font-semibold">
                        Total Products
                    </h2>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-500 mt-2">
                        {productsCount}
                    </p>
                </div>

                {/* Orders */}
                <div className="bg-white shadow-md rounded-xl p-5 sm:p-6 border-l-4 border-[#37888F] hover:shadow-lg transition">
                    <h2 className="text-base sm:text-lg font-semibold">
                        Total Orders
                    </h2>
                    <p className="text-2xl sm:text-3xl font-bold text-[#37888F] mt-2">
                        {ordersCount}
                    </p>
                </div>

                {/* Messages */}
                <div className="bg-white shadow-md rounded-xl p-5 sm:p-6 border-l-4 border-[#AB315A] hover:shadow-lg transition">
                    <h2 className="text-base sm:text-lg font-semibold">
                        Messages
                    </h2>
                    <p className="text-2xl sm:text-3xl font-bold text-[#AB315A] mt-2">
                        {messagesCount}
                    </p>
                </div>
            </div>
        </div>
    );
}