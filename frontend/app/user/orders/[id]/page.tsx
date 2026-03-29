"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Package, CreditCard, Truck, Clock,
    MapPin, User, Mail, Loader2,
    CheckCircle2, XCircle, Trash2, ExternalLink,
    ShoppingBag, Receipt, CalendarDays, Hash,
    AlertCircle, Circle, Ban,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

type ProductImage = { url: string; cloudinary_id: string };
type PaymentReceipt = { url: string; cloudinary_id: string };

type Order = {
    id: number;
    product_id: number;
    product_name: string;
    product_price: string;
    product_image: ProductImage[];
    quantity: number;
    payment_method: string;
    payment_status: string;
    payment_receipt: PaymentReceipt | null;
    order_status: string;
    is_delivered: boolean;
    total_price: string;
    shipping_price: string;
    address_line: string;
    city: string;
    country: string;
    postal_code: string;
    email: string;
    user_id: number;
    created_at: string;
    paid_at: string | null;
    delivered_at: string | null;
};

function formatDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PK", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ─── Status Config with icons ─────────────────────────────────────────────────
const ORDER_STATUS_CONFIG: Record<string, {
    bg: string; text: string; border: string; dot: string;
    icon: React.ReactNode; label: string;
}> = {
    pending:    { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B", icon: <Clock className="h-3.5 w-3.5" />,        label: "Pending" },
    processing: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE", dot: "#3B82F6", icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Processing" },
    shipped:    { bg: "#F0F9FF", text: "#0C4A6E", border: "#BAE6FD", dot: "#0EA5E9", icon: <Truck className="h-3.5 w-3.5" />,        label: "Shipped" },
    delivered:  { bg: "#F0FDF4", text: "#14532D", border: "#BBF7D0", dot: "#22C55E", icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Delivered" },
    cancelled:  { bg: "#FFF1F2", text: "#881337", border: "#FECDD3", dot: "#F43F5E", icon: <Ban className="h-3.5 w-3.5" />,          label: "Cancelled" },
};

const PAY_STATUS_CONFIG: Record<string, {
    bg: string; text: string; border: string; dot: string; icon: React.ReactNode;
}> = {
    pending: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B", icon: <Clock className="h-3.5 w-3.5" /> },
    paid:    { bg: "#F0FDF4", text: "#14532D", border: "#BBF7D0", dot: "#22C55E", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    failed:  { bg: "#FFF1F2", text: "#881337", border: "#FECDD3", dot: "#F43F5E", icon: <XCircle className="h-3.5 w-3.5" /> },
};

function OrderStatusBadge({ status }: { status: string }) {
    const key = status.toLowerCase();
    const c = ORDER_STATUS_CONFIG[key] ?? ORDER_STATUS_CONFIG["pending"];
    return (
        <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize">
            {c.icon}
            {c.label}
        </span>
    );
}

function PayStatusBadge({ status }: { status: string }) {
    const key = status.toLowerCase();
    const c = PAY_STATUS_CONFIG[key] ?? PAY_STATUS_CONFIG["pending"];
    return (
        <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize">
            {c.icon}
            {status}
        </span>
    );
}

// ─── Order Progress Tracker ───────────────────────────────────────────────────
const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

function OrderTracker({ status, isDelivered }: { status: string; isDelivered: boolean }) {
    const key = status.toLowerCase();
    if (key === "cancelled") {
        return (
            <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3" }}
                className="rounded-2xl p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Ban className="h-5 w-5 text-red-500" />
                </div>
                <div>
                    <p className="font-bold text-red-700 text-sm">Order Cancelled</p>
                    <p className="text-xs text-red-400 mt-0.5">This order has been cancelled</p>
                </div>
            </div>
        );
    }

    // ✅ If is_delivered is true, always show Delivered as the current step
    const effectiveKey = isDelivered ? "delivered" : key;
    const currentIdx = STEPS.findIndex(s => s.toLowerCase() === effectiveKey);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Progress</p>
            <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 z-0" />
                <div
                    className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-[#B9974F] to-[#f0b866] z-0 transition-all duration-700"
                    style={{ width: currentIdx < 0 ? "0%" : `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, i) => {
                    const done = i <= currentIdx;
                    const active = i === currentIdx;
                    return (
                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: done ? "linear-gradient(135deg,#B9974F,#f0b866)" : "#f3f4f6",
                                border: active ? "3px solid #f0b866" : done ? "none" : "2px solid #e5e7eb",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: active ? "0 0 0 4px rgba(185,151,79,0.15)" : "none",
                                transition: "all 0.3s",
                            }}>
                                {done
                                    ? <CheckCircle2 className="h-4 w-4 text-white" />
                                    : <Circle className="h-3 w-3 text-gray-300" />
                                }
                            </div>
                            <p style={{ color: done ? "#B9974F" : "#9ca3af" }}
                                className="text-[10px] font-semibold text-center leading-tight">
                                {step}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel, loading }: { onConfirm: () => void; onCancel: () => void; loading: boolean }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-7 w-7 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Cancel this order?</h2>
                <p className="text-sm text-gray-400 mb-6">This action is permanent and cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Keep Order
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Yes, cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <span className="p-2 rounded-lg bg-gray-50 text-[#B9974F] flex-shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                <div className="text-sm text-gray-700 font-medium break-words">{value}</div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${API}/api/order/user/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrder(res.data.order ?? res.data);
            } catch (err: any) {
                setError(err?.response?.data?.msg || "Failed to load order.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        setDeleting(true);
        try {
            await axios.delete(`${API}/api/order/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeleted(true);
            setShowModal(false);
            setTimeout(() => router.push("/user/orders"), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.msg || "Failed to cancel order.");
            setShowModal(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-[#B9974F]" />
                <p className="text-gray-400 text-sm font-medium">Loading order…</p>
            </div>
        </div>
    );

    if (deleted) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-10 max-w-sm w-full text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Order Cancelled</h2>
                <p className="text-sm text-gray-400">Redirecting to your orders…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-sm w-full text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-5">{error}</p>
                <Link href="/user/orders"
                    className="bg-[#B9974F] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#a0833e] transition-colors">
                    Back to Orders
                </Link>
            </div>
        </div>
    );

    if (!order) return null;

    const subtotal = Number(order.total_price) - Number(order.shipping_price);
    const canDelete = order.order_status.toLowerCase() === "pending";
    const thumb = order.product_image?.[0]?.url ?? null;

    return (
        <>
            {showModal && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowModal(false)} loading={deleting} />}

            <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
                <div className="max-w-3xl mx-auto space-y-4">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/user/orders"
                                className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors">
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-[#B9974F]" />
                                    Order #{order.id}
                                </h1>
                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                    <CalendarDays className="h-3 w-3" />
                                    {formatDate(order.created_at)}
                                </p>
                            </div>
                        </div>
                        <OrderStatusBadge status={order.order_status} />
                    </div>

                    {/* ── Order Tracker ── */}
                    {/* ✅ Pass is_delivered so tracker stays in sync with delivery status */}
                    <OrderTracker status={order.order_status} isDelivered={order.is_delivered} />

                    {/* ── Product card ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <ShoppingBag className="h-3.5 w-3.5" /> Product
                            </p>
                        </div>
                        <div className="p-5 flex items-start gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                {thumb ? (
                                    <Image src={thumb} alt={order.product_name} width={80} height={80}
                                        className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-8 w-8 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-base mb-1 truncate">{order.product_name}</p>
                                <p className="text-sm text-gray-500 mb-3">
                                    Qty: <span className="font-semibold text-gray-700">{order.quantity}</span>
                                    &nbsp;·&nbsp; Unit: <span className="font-semibold text-gray-700">
                                        PKR {Number(order.product_price).toLocaleString()}
                                    </span>
                                </p>
                                <Link href={`/user/collections/all/${order.product_id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B9974F] hover:text-[#a0833e] transition-colors">
                                    View Product <ExternalLink className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Payment + Delivery ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Payment */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5" /> Payment
                                </p>
                            </div>
                            <div className="px-5 py-1">
                                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Method"
                                    value={order.payment_method.replace(/_/g, " ")} />
                                <InfoRow icon={<CheckCircle2 className="h-4 w-4" />} label="Payment Status"
                                    value={<PayStatusBadge status={order.payment_status} />} />
                                <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Paid At"
                                    value={formatDate(order.paid_at)} />
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Truck className="h-3.5 w-3.5" /> Delivery
                                </p>
                            </div>
                            <div className="px-5 py-1">
                                <InfoRow icon={<Truck className="h-4 w-4" />} label="Status"
                                    value={
                                        <span style={order.is_delivered
                                            ? { background: "#F0FDF4", color: "#14532D", border: "1px solid #BBF7D0" }
                                            : { background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold">
                                            {order.is_delivered
                                                ? <><CheckCircle2 className="h-3.5 w-3.5" /> Delivered</>
                                                : <><Clock className="h-3.5 w-3.5" /> Pending</>
                                            }
                                        </span>
                                    } />
                                <InfoRow icon={<Clock className="h-4 w-4" />} label="Delivered At"
                                    value={formatDate(order.delivered_at)} />
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address"
                                    value={`${order.address_line}, ${order.city}, ${order.country} – ${order.postal_code}`} />
                            </div>
                        </div>
                    </div>

                    {/* ── Customer ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" /> Customer
                            </p>
                        </div>
                        <div className="px-5 py-1">
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={order.email} />
                            <InfoRow icon={<Hash className="h-4 w-4" />} label="User ID" value={`#${order.user_id}`} />
                        </div>
                    </div>

                    {/* ── Price Summary ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price Summary</p>
                        </div>
                        <div className="p-5 space-y-2.5">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-700">PKR {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Shipping</span>
                                <span className="font-semibold text-gray-700">PKR {Number(order.shipping_price).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="text-xl font-bold text-[#B9974F]">
                                    PKR {Number(order.total_price).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Payment Receipt ── */}
                    {order.payment_receipt?.url && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Receipt</p>
                            </div>
                            <div className="p-5">
                                <a href={order.payment_receipt.url} target="_blank" rel="noopener noreferrer"
                                    className="block relative rounded-xl overflow-hidden border border-gray-100 hover:opacity-90 transition-opacity">
                                    <Image src={order.payment_receipt.url} alt="Payment receipt"
                                        width={600} height={400} className="w-full object-cover max-h-72" />
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                                        <ExternalLink className="h-3 w-3" /> Open full size
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex items-center justify-between gap-4 pb-6">
                        <Link href="/user/orders"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors">
                            <ArrowLeft className="h-4 w-4" /> All orders
                        </Link>
                        {canDelete && (
                            <button onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 bg-red-50 text-red-500 border border-red-100 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 className="h-4 w-4" /> Cancel Order
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}