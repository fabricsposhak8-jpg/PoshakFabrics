"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, Package, CreditCard, Truck, CheckCircle2, Clock, XCircle, AlertCircle, ExternalLink, MapPin, Save, X } from 'lucide-react'

const OrderDetailPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const API = process.env.NEXT_PUBLIC_BACKEND_URL

    // ✅ Per-section update mode: "payment" | "order" | "delivery" | null
    const [updatingSection, setUpdatingSection] = useState<"payment" | "order" | "delivery" | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // ✅ is_delivered as string to match <select> value
    const [updatedStatus, setUpdatedStatus] = useState({
        order_status: "",
        payment_status: "",
        is_delivered: "false",
    })

    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${API}/api/order/admin/get/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setOrder(data.order)
            } catch (error) {
                console.error("Error fetching order:", error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchOrder()
    }, [id])

    // Seed form with current order values when opening a section
    const openSection = (section: "payment" | "order" | "delivery") => {
        setUpdatedStatus({
            order_status: order.order_status ?? "",
            payment_status: order.payment_status ?? "",
            is_delivered: order.is_delivered ? "true" : "false",
        })
        setUpdatingSection(section)
    }

    const cancelUpdate = () => setUpdatingSection(null)

    const handleUpdate = async (field: "payment" | "order" | "delivery") => {
        setIsSaving(true)
        try {
            const token = localStorage.getItem("token")
            const payload: any = { id }
            if (field === "payment") payload.payment_status = updatedStatus.payment_status
            if (field === "order") payload.order_status = updatedStatus.order_status
            if (field === "delivery") payload.is_delivered = updatedStatus.is_delivered === "true"

            const response = await fetch(`${API}/api/order/update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            const data = await response.json()
            // Update local state so UI reflects changes immediately
            setOrder((prev: any) => ({ ...prev, ...data.order }))
            setUpdatingSection(null)
        } catch (error) {
            console.error("Update failed:", error)
        } finally {
            setIsSaving(false)
        }
    }

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
            <div style={{ width: 40, height: 40, border: "3px solid #f0e6d3", borderTopColor: "#d4862a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
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
        backBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "0.84rem", fontWeight: 500, marginBottom: 20, padding: "4px 0" } as React.CSSProperties,
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
        actionBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#d4862a,#f0b866)", color: "#1a0800", fontSize: "0.82rem", fontWeight: 700, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", marginTop: 12 } as React.CSSProperties,
        cancelBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f3f4f6", color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", marginTop: 12, marginLeft: 8 } as React.CSSProperties,
        select: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px", fontSize: "0.82rem", color: "#111827", background: "#fff", cursor: "pointer", outline: "none" } as React.CSSProperties,
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

                        {/* ✅ Only this card's select shows when updatingSection === "payment" */}
                        <div style={S.row}>
                            <span style={S.label}>Status</span>
                            {updatingSection === "payment" ? (
                                <select
                                    style={S.select}
                                    value={updatedStatus.payment_status}
                                    onChange={(e) => setUpdatedStatus({ ...updatedStatus, payment_status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            ) : (
                                <span style={S.badge(pStatus)}>{order.payment_status}</span>
                            )}
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

                        {/* ✅ Save/Cancel when editing, Update button otherwise */}
                        {updatingSection === "payment" ? (
                            <div>
                                <button style={S.actionBtn} onClick={() => handleUpdate("payment")} disabled={isSaving}>
                                    <Save size={14} /> {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button style={S.cancelBtn} onClick={cancelUpdate}>
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button style={S.actionBtn} onClick={() => openSection("payment")}>
                                Update Payment Status
                            </button>
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
                            ["City", order.city || "—"],
                            ["Country", order.country || "—"],
                            ["Postal Code", order.postal_code || "—"],
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
                        {/* ✅ Only this card's select shows when updatingSection === "order" */}
                        <div style={S.row}>
                            <span style={S.label}>Status</span>
                            {updatingSection === "order" ? (
                                <select
                                    style={S.select}
                                    value={updatedStatus.order_status}
                                    onChange={(e) => setUpdatedStatus({ ...updatedStatus, order_status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            ) : (
                                <span style={S.badge(oStatus)}>{oStatus.icon} {order.order_status}</span>
                            )}
                        </div>

                        <div style={{ ...S.row, borderBottom: "none" }}>
                            <span style={S.label}>Placed</span>
                            <span style={S.val}>{fmtDate(order.created_at)}</span>
                        </div>

                        {updatingSection === "order" ? (
                            <div>
                                <button style={S.actionBtn} onClick={() => handleUpdate("order")} disabled={isSaving}>
                                    <Save size={14} /> {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button style={S.cancelBtn} onClick={cancelUpdate}>
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button style={S.actionBtn} onClick={() => openSection("order")}>
                                Update Order Status
                            </button>
                        )}
                    </div>
                </div>

                {/* Delivery */}
                <div style={S.card}>
                    <div style={S.cardHead}>
                        <div style={S.cardIcon}><Truck size={15} /></div>
                        <span style={S.cardTitle}>Delivery</span>
                    </div>
                    <div style={S.cardBody}>
                        {/* ✅ Only this card's select shows when updatingSection === "delivery" */}
                        <div style={S.row}>
                            <span style={S.label}>Delivered</span>
                            {updatingSection === "delivery" ? (
                                <select
                                    style={S.select}
                                    value={updatedStatus.is_delivered}
                                    onChange={(e) => setUpdatedStatus({ ...updatedStatus, is_delivered: e.target.value })}
                                >
                                    <option value="true">Yes — Delivered</option>
                                    <option value="false">No — Pending</option>
                                </select>
                            ) : (
                                <span style={order.is_delivered
                                    ? S.badge({ bg: "#f0fdf4", color: "#15803d" })
                                    : S.badge({ bg: "#fff7ed", color: "#c2410c" })
                                }>
                                    {order.is_delivered ? <><CheckCircle2 size={12} /> Yes</> : <><Clock size={12} /> Pending</>}
                                </span>
                            )}
                        </div>

                        <div style={{ ...S.row, borderBottom: "none" }}>
                            <span style={S.label}>Delivered At</span>
                            <span style={S.val}>{fmtDate(order.delivered_at)}</span>
                        </div>

                        {updatingSection === "delivery" ? (
                            <div>
                                <button style={S.actionBtn} onClick={() => handleUpdate("delivery")} disabled={isSaving}>
                                    <Save size={14} /> {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button style={S.cancelBtn} onClick={cancelUpdate}>
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button style={S.actionBtn} onClick={() => openSection("delivery")}>
                                Update Delivery Status
                            </button>
                        )}
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