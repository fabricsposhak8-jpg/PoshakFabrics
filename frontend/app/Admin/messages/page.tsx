"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
}

const Messages = () => {
    const [token, setToken] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    // Fetch messages from backend
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {
        if (token) fetchMessages();
    }, [token]);

    // Delete message
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchMessages();
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                All Messages
            </h1>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Message</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {messages.map((msg) => (
                            <tr key={msg.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{msg.id}</td>
                                <td className="p-3">{msg.name}</td>
                                <td className="p-3">{msg.email}</td>
                                <td className="p-3">{msg.message}</td>
                                <td className="p-3">{new Date(msg.created_at).toLocaleString()}</td>
                                <td className="p-3 flex justify-center gap-3">
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-6 text-gray-500">
                                    No messages found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Messages;