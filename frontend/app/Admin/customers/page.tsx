"use client"
import React, { useEffect, useState } from 'react'
import { Users, Search, Mail, Calendar, Shield } from 'lucide-react'

interface Customer {
    id: number
    username: string
    email: string
    role: string
    created_at: string
}

const CustomerPage = () => {
    const API = process.env.NEXT_PUBLIC_BACKEND_URL
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API}/api/auth/all-users`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setCustomers(data.users)
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-PK", { dateStyle: "medium" })

    const filtered = customers.filter(c =>
        c.username.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        String(c.id).includes(search)
    )

    const initials = (name: string) =>
        name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

    const avatarColors = [
        ["#fff7ed", "#c2410c"],
        ["#f0fdf4", "#15803d"],
        ["#eff6ff", "#1d4ed8"],
        ["#fdf4ff", "#7e22ce"],
        ["#fff1f2", "#be123c"],
        ["#f0f9ff", "#0369a1"],
    ]

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing:border-box; }
                .cust-root { min-height:100vh; background:#f9fafb; padding:28px 24px; font-family:'Inter',sans-serif; }

                .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; flex-wrap:wrap; gap:12px; }
                .page-title { font-size:1.4rem; font-weight:700; color:#111827; }
                .page-sub   { font-size:0.82rem; color:#9ca3af; margin-top:2px; }

                .search-wrap {
                    position:relative;
                }
                .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; }
                .search-input {
                    padding:9px 12px 9px 36px;
                    border:1px solid #e5e7eb; border-radius:10px;
                    font-size:0.85rem; font-family:'Inter',sans-serif;
                    outline:none; background:#fff; width:240px;
                    transition:border-color 0.2s, box-shadow 0.2s;
                }
                .search-input:focus { border-color:#d4862a; box-shadow:0 0 0 3px rgba(212,134,42,0.12); }

                .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
                .stat-card { background:#fff; border-radius:14px; border:1px solid #f0f0f0; box-shadow:0 1px 5px rgba(0,0,0,0.05); padding:16px 18px; display:flex; align-items:center; gap:14px; }
                .stat-icon { width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#d4862a,#f0b866);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 3px 10px rgba(212,134,42,0.28);flex-shrink:0; }
                .stat-num  { font-size:1.5rem; font-weight:800; color:#111827; line-height:1; }
                .stat-label{ font-size:0.75rem; color:#9ca3af; margin-top:3px; }

                .card { background:#fff; border-radius:14px; border:1px solid #f0f0f0; box-shadow:0 1px 6px rgba(0,0,0,0.05); overflow:hidden; }
                .card-head { display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid #f3f4f6; background:#fafafa; }
                .card-icon { width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#d4862a,#f0b866);display:flex;align-items:center;justify-content:center;color:#fff; box-shadow:0 3px 8px rgba(212,134,42,0.25); }
                .card-title { font-size:0.86rem; font-weight:600; color:#374151; }

                .table { width:100%; border-collapse:collapse; font-size:0.84rem; }
                .table th { text-align:left; padding:11px 16px; background:#f9fafb; color:#6b7280; font-size:0.74rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }
                .table td { padding:12px 16px; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
                .table tr:last-child td { border-bottom:none; }
                .table tr:hover td { background:#fafafa; }

                .avatar {
                    width:36px; height:36px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:0.78rem; font-weight:700; flex-shrink:0;
                }
                .user-cell { display:flex; align-items:center; gap:10px; }
                .user-name  { font-weight:600; color:#111827; font-size:0.88rem; }
                .user-id    { font-size:0.74rem; color:#9ca3af; }

                .empty { text-align:center; padding:40px; color:#9ca3af; font-size:0.88rem; }

                @media(max-width:640px){
                    .stats-row { grid-template-columns:1fr 1fr; }
                    .table th:nth-child(3),.table td:nth-child(3) { display:none; }
                }
            `}</style>

            <div className="cust-root">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Customers</h1>
                        <p className="page-sub">Manage all registered users</p>
                    </div>
                    <div className="search-wrap">
                        <Search size={15} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Search by name, email, ID…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon"><Users size={18} /></div>
                        <div>
                            <p className="stat-num">{customers.length}</p>
                            <p className="stat-label">Total Customers</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Calendar size={18} /></div>
                        <div>
                            <p className="stat-num">
                                {customers.filter(c => {
                                    const d = new Date(c.created_at)
                                    const now = new Date()
                                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                                }).length}
                            </p>
                            <p className="stat-label">Joined This Month</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><Shield size={18} /></div>
                        <div>
                            <p className="stat-num">{filtered.length}</p>
                            <p className="stat-label">Showing Now</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card">
                    <div className="card-head">
                        <div className="card-icon"><Users size={15} /></div>
                        <span className="card-title">All Customers</span>
                    </div>

                    {loading ? (
                        <div className="empty">Loading customers…</div>
                    ) : filtered.length === 0 ? (
                        <div className="empty">No customers found.</div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((c, i) => {
                                        const [bg, color] = avatarColors[i % avatarColors.length]
                                        return (
                                            <tr key={c.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="avatar" style={{ background: bg, color }}>
                                                            {initials(c.username)}
                                                        </div>
                                                        <div>
                                                            <p className="user-name">{c.username}</p>
                                                            <p className="user-id">ID #{c.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280" }}>
                                                        <Mail size={13} />
                                                        {c.email}
                                                    </div>
                                                </td>
                                                <td style={{ color: "#6b7280" }}>
                                                    {fmtDate(c.created_at)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CustomerPage