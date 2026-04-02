"use client";
import React, { useEffect, useState } from "react";
import {
    Trash2, AlertTriangle, CheckCircle2, X, Loader2,
    Mail, User, Calendar, MessageSquare, Search
} from "lucide-react";

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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; messageId: number | null }>({
        isOpen: false,
        messageId: null
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch messages from backend
    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {
        if (token) fetchMessages();
    }, [token]);

    const handleDeleteConfirm = async () => {
        if (!deleteModal.messageId) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${deleteModal.messageId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setSuccessMessage("Message deleted successfully.");
            setTimeout(() => setSuccessMessage(""), 3000);
            fetchMessages();
        } catch (error) {
            console.error("Error deleting message:", error);
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, messageId: null });
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Mail className="h-6 w-6 text-[#B9974F]" />
                            Customer Messages
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Review and manage messages sent from the contact form</p>
                    </div>
                </div>

                {/* Success Toast */}
                {successMessage && (
                    <div
                        style={{ animation: "slideInToast 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 text-green-700 px-5 py-4 rounded-2xl shadow-2xl shadow-green-100 min-w-[300px]"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Success!</p>
                            <p className="text-xs text-gray-400 mt-0.5">{successMessage}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccessMessage("")}
                            className="ml-auto text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <style>{`
                            @keyframes slideInToast {
                                from { opacity: 0; transform: translateX(110%) scale(0.9); }
                                to   { opacity: 1; transform: translateX(0)   scale(1);   }
                            }
                        `}</style>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-3">
                    <Search className="h-5 w-5 text-gray-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Search messages by name, email or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-gray-800 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    />
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Message</th>
                                    <th className="px-6 py-4 font-semibold">Sent Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-[#B9974F]" />
                                            <p>Loading messages...</p>
                                        </td>
                                    </tr>
                                ) : filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                                            <p className="text-gray-500 font-medium">No messages found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#B9974F]/10 flex items-center justify-center text-[#B9974F] font-bold text-base">
                                                        {msg.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800">{msg.name}</span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <User className="h-3 w-3" /> {msg.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-[300px] sm:max-w-[400px]">
                                                    <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed">
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, messageId: msg.id })}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Message"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
                        <div
                            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[modalIn_0.2s_ease-out]"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Message?</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to delete this message? This action cannot be undone.
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: false, messageId: null })}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <style>{`
                            @keyframes modalIn {
                                from { opacity: 0; transform: scale(0.95); }
                                to { opacity: 1; transform: scale(1); }
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;