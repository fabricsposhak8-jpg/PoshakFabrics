"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft, User, Package, CreditCard, Truck, CheckCircle2, Clock, XCircle, AlertCircle, ExternalLink, MapPin } from 'lucide-react'

const OrderDetailPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const API = process.env.NEXT_PUBLIC_BACKEND_URL

    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${API}/api/order/admin/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setOrder(response.data.order)
            } catch (error) {
                console.error("Error fetching order:", error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchOrder()
    }, [id])

    const fmtDate = (iso: string | null) =>
        iso ? new Date(iso).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) : "—"

    const fmt = (val: string | number) =>
        `Rs ${Number(val).toLocaleString("en-PK")}`

    const orderStatusConfig: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
        Pending: { bg: "#fff7ed", color: "#c2410c", icon: <Clock size={12} /> },
        Processing: { bg: "#eff6ff", color: "#1d4ed8", icon: <AlertCircle size={12} /> },
        Shipped: { bg: "#f0f9ff", color: "#0369a1", icon: <Truck size={12} /> },
        Delivered: { bg: "#f0fdf4", color: "#15803d", icon: <CheckCircle2 size={12} /> },
        Cancelled: { bg: "#fef2f2", color: "#b91c1c", icon: <XCircle size={12} /> },
    }

    const payStatusConfig: Record<string, { bg: string; color: string }> = {
        Pending: { bg: "#fff7ed", color: "#c2410c" },
        Paid: { bg: "#f0fdf4", color: "#15803d" },
        Failed: { bg: "#fef2f2", color: "#b91c1c" },
    }

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f9fafb" }}>
            <div style={{
                width: 40, height: 40, border: "3px solid #f0e6d3",
                borderTopColor: "#d4862a", borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
            }} />
            <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
        </div>
    )

    if (!order) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f9fafb" }}>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Order not found.</p>
        </div>
    )

    const oStatus = orderStatusConfig[order.order_status] ?? orderStatusConfig["Pending"]
    const pStatus = payStatusConfig[order.payment_status] ?? payStatusConfig["Pending"]
    const firstImg = Array.isArray(order.product_image) && order.product_image.length > 0
        ? order.product_image[0]?.url : null

    let receipt: { url: string } | null = null
    try {
        receipt = typeof order.payment_receipt === "string"
            ? JSON.parse(order.payment_receipt)
            : order.payment_receipt
    } catch { receipt = null }

    const S = {
        root: { minHeight: "100vh", background: "#f9fafb", padding: "28px 24px", fontFamily: "'Inter',sans-serif" } as React.CSSProperties,
        backBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "0.84rem", fontWeight: 500, marginBottom: 20, padding: "4px 0", transition: "color 0.2s" } as React.CSSProperties,
        heading: { fontSize: "1.55rem", fontWeight: 700, color: "#111827", marginBottom: 2 } as React.CSSProperties,
        sub: { fontSize: "0.82rem", color: "#9ca3af", marginBottom: 24 } as React.CSSProperties,
        grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 } as React.CSSProperties,
        grid1: { display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 16 } as React.CSSProperties,
        card: { background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" } as React.CSSProperties,
        cardHead: { display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" } as React.CSSProperties,
        cardIcon: { width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#d4862a,#f0b866)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0, boxShadow: "0 3px 10px rgba(212,134,42,0.28)" } as React.CSSProperties,
        cardTitle: { fontSize: "0.86rem", fontWeight: 600, color: "#374151" } as React.CSSProperties,
        cardBody: { padding: "14px 18px" } as React.CSSProperties,
        row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f9fafb" } as React.CSSProperties,
        label: { fontSize: "0.79rem", color: "#9ca3af", fontWeight: 500 } as React.CSSProperties,
        val: { fontSize: "0.88rem", color: "#111827", fontWeight: 600, textAlign: "right" as const, maxWidth: "60%", wordBreak: "break-word" as const },
        badge: (cfg: { bg: string; color: string }) => ({ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.74rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: cfg.bg, color: cfg.color }) as React.CSSProperties,
        totalBand: { background: "linear-gradient(135deg,#1a0a00,#3a1c00)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 } as React.CSSProperties,
        receiptBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#d4862a,#f0b866)", color: "#1a0800", fontSize: "0.82rem", fontWeight: 700, padding: "8px 16px", borderRadius: 8, textDecoration: "none", marginTop: 12 } as React.CSSProperties,
    }

    return (
        <div style={S.root}>
            {/* Back */}
            <button style={S.backBtn} onClick={() => router.back()}>
                <ArrowLeft size={15} /> Back to Orders
            </button>

            {/* Page header */}
            <h1 style={S.heading}>Order #{order.id}</h1>
            <p style={S.sub}>Placed on {fmtDate(order.created_at)}</p>

            {/* Product card */}
            <div style={S.grid1}>
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><Package size={15} /></div>
                        <span style={S.cardTitle}>Product Details</span>
                    </div>
                    <div style={S.cardBody}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                            {firstImg
                                ? <img src={firstImg} alt={order.product_name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid #f0f0f0", flexShrink: 0 }} />
                                : <div style={{ width: 80, height: 80, borderRadius: 10, background: "linear-gradient(135deg,#f3e8d5,#fdf6ec)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0 }}>🧵</div>
                            }
                            <div>
                                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: 4 }}>{order.product_name}</p>
                                <p style={{ fontSize: "0.84rem", color: "#6b7280" }}>Unit price: {fmt(order.product_price)}</p>
                                <p style={{ fontSize: "0.84rem", color: "#6b7280" }}>Qty: {order.quantity ?? 1}</p>
                                <p style={{ fontSize: "0.84rem", color: "#6b7280" }}>Product ID: #{order.product_id}</p>
                            </div>
                        </div>

                        {/* Total band */}
                        <div style={S.totalBand}>
                            <div>
                                <p style={{ fontSize: "0.78rem", color: "rgba(240,184,102,0.7)" }}>Subtotal</p>
                                <p style={{ fontSize: "0.78rem", color: "rgba(240,184,102,0.5)", marginTop: 3 }}>+ Shipping {fmt(order.shipping_price)}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: "0.78rem", color: "rgba(240,184,102,0.7)" }}>Total Charged</p>
                                <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f0b866", marginTop: 3 }}>{fmt(order.total_price)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer + Payment row */}
            <div style={S.grid2}>
                {/* Customer */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><User size={15} /></div>
                        <span style={S.cardTitle}>Customer</span>
                    </div>
                    <div style={S.cardBody}>
                        {[
                            ["Name", order.username],
                            ["Email", order.email],
                            ["User ID", `#${order.user_id}`],
                        ].map(([lbl, val]) => (
                            <div key={lbl} style={{ ...S.row, borderBottom: lbl === "User ID" ? "none" : "1px solid #f9fafb" }}>
                                <span style={S.label}>{lbl}</span>
                                <span style={S.val}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><CreditCard size={15} /></div>
                        <span style={S.cardTitle}>Payment</span>
                    </div>
                    <div style={S.cardBody}>
                        <div style={S.row}>
                            <span style={S.label}>Method</span>
                            <span style={{ ...S.val, textTransform: "capitalize" }}>{order.payment_method}</span>
                        </div>
                        <div style={S.row}>
                            <span style={S.label}>Status</span>
                            <span style={S.badge(pStatus)}>{order.payment_status}</span>
                        </div>
                        <div style={{ ...S.row, borderBottom: "none" }}>
                            <span style={S.label}>Paid At</span>
                            <span style={S.val}>{fmtDate(order.paid_at)}</span>
                        </div>
                        {receipt?.url && (
                            <a href={receipt.url} target="_blank" rel="noreferrer" style={S.receiptBtn}>
                                <ExternalLink size={14} /> View Receipt
                            </a>
                        )}
                        {!receipt?.url && (
                            <p style={{ fontSize: "0.78rem", color: "#d1d5db", marginTop: 10 }}>No receipt uploaded</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Details */}
            <div style={{ ...S.grid1, marginTop: 0 }}>
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><MapPin size={15} /></div>
                        <span style={S.cardTitle}>Delivery Address</span>
                    </div>
                    <div style={{ ...S.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                        {[
                            ["Address Line", order.address_line || "—"],
                            ["City",         order.city        || "—"],
                            ["Country",      order.country     || "—"],
                            ["Postal Code",  order.postal_code || "—"],
                        ].map(([lbl, val], i, arr) => (
                            <div key={lbl} style={{ ...S.row, borderBottom: i >= arr.length - 2 ? "none" : "1px solid #f9fafb" }}>
                                <span style={S.label}>{lbl}</span>
                                <span style={S.val}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Order Status + Delivery row */}
            <div style={S.grid2}>
                {/* Order Status */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><AlertCircle size={15} /></div>
                        <span style={S.cardTitle}>Order Status</span>
                    </div>
                    <div style={S.cardBody}>
                        <div style={S.row}>
                            <span style={S.label}>Status</span>
                            <span style={S.badge(oStatus)}>{oStatus.icon} {order.order_status}</span>
                        </div>
                        <div style={{ ...S.row, borderBottom: "none" }}>
                            <span style={S.label}>Placed</span>
                            <span style={S.val}>{fmtDate(order.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><Truck size={15} /></div>
                        <span style={S.cardTitle}>Delivery</span>
                    </div>
                    <div style={S.cardBody}>
                        <div style={S.row}>
                            <span style={S.label}>Delivered</span>
                            <span style={order.is_delivered
                                ? S.badge({ bg: "#f0fdf4", color: "#15803d" })
                                : S.badge({ bg: "#fff7ed", color: "#c2410c" })
                            }>
                                {order.is_delivered ? <><CheckCircle2 size={12} /> Yes</> : <><Clock size={12} /> Pending</>}
                            </span>
                        </div>
                        <div style={{ ...S.row, borderBottom: "none" }}>
                            <span style={S.label}>Delivered At</span>
                            <span style={S.val}>{fmtDate(order.delivered_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes spin { to { transform: rotate(360deg) } }
                @media (max-width: 700px) {
                    .od-grid2 { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    )
}

export default OrderDetailPage