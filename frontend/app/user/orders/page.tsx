"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
    ShoppingBag, Package, CreditCard, Truck, Clock,
    ChevronRight, Loader2, AlertCircle, ArrowLeft, Receipt
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

type Order = {
    id: number;
    product_id: number;
    payment_method: string;
    total_price: string;
    shipping_price: string;
    status?: string;
    created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-PK", {
        year: "numeric", month: "short", day: "numeric",
    });
}

function PaymentBadge({ method }: { method: string }) {
    const label = method?.replace(/_/g, " ");
    return (
        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize font-medium">
            <CreditCard className="h-3 w-3" /> {label}
        </span>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please log in to view your orders.");
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API}/api/order/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // API returns { msg, order }
                setOrders(res.data.order || []);
            } catch (err: any) {
                setError(err?.response?.data?.msg || "Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-[#B9974F]" />
                    <p className="text-gray-500 text-sm">Loading your orders…</p>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-sm w-full text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-4">{error}</p>
                    <Link href="/" className="bg-[#B9974F] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#a0833e] transition-colors">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link href="/user/collections" className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Receipt className="h-6 w-6 text-[#B9974F]" />
                            My Orders
                        </h1>
                        <p className="text-sm text-gray-400">
                            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
                        </p>
                    </div>
                </div>

                {/* Empty state */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="bg-gray-50 rounded-full p-5 inline-flex mb-4">
                            <ShoppingBag className="h-12 w-12 text-gray-300" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-700 mb-1">No orders yet</h2>
                        <p className="text-gray-400 text-sm mb-6">You haven't placed any orders. Start shopping!</p>
                        <Link
                            href="/user/collections"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B9974F] transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Browse Collections
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders
                            .slice()
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Top bar */}
                                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{formatDate(order.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[order.status ?? "pending"] ?? STATUS_STYLES["pending"]}`}>
                                                {order.status ?? "Pending"}
                                            </span>
                                            <span className="text-xs text-gray-300">#{order.id}</span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Left */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Package className="h-7 w-7 text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                                        Product #{order.product_id}
                                                    </p>
                                                    <PaymentBadge method={order.payment_method} />
                                                </div>
                                            </div>

                                            {/* Right – pricing */}
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-bold text-[#B9974F]">
                                                    PKR {Number(order.total_price).toLocaleString()}
                                                </p>
                                                <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-0.5">
                                                    <Truck className="h-3 w-3" />
                                                    Shipping: PKR {Number(order.shipping_price).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* View product link */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <p className="text-xs text-gray-400">
                                                Subtotal: PKR {(Number(order.total_price) - Number(order.shipping_price)).toLocaleString()}
                                            </p>
                                            <Link
                                                href={`/user/collections/all/${order.product_id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B9974F] hover:text-[#a0833e] transition-colors group"
                                            >
                                                View Product
                                                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {orders.length > 0 && (
                    <div className="mt-6 text-center">
                        <Link
                            href="/user/collections"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B9974F] transition-colors shadow-md"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
