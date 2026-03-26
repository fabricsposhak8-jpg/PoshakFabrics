"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Matches columns returned by: SELECT * FROM orders
interface OrderItem {
    id: number
    username: string
    product_name: string
    payment_method: string
    total_price: number
    shipping_price: number
    payment_receipt: { url: string; cloudinary_id: string } | null
    created_at: string
}

// Matches the API response: { msg: string, order: OrderItem[] }
interface OrdersResponse {
    msg: string
    order: OrderItem[]
}

const OrdersPage = () => {
    const [Orders, setOrders] = useState<OrdersResponse>({ msg: "", order: [] })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterMethod, setFilterMethod] = useState("all")
    const API = process.env.NEXT_PUBLIC_BACKEND_URL

    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API}/api/order/admin/get`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setOrders(response.data)
                console.log("Orders", response.data)
            } catch (error) {
                console.error("Error fetching orders:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    // Unique payment methods for filter dropdown
    const paymentMethods = ["all", ...Array.from(new Set(Orders.order.map(o => o.payment_method)))]

    // Filtered orders based on search + payment method filter
    const filtered = Orders.order.filter((item) => {
        const matchesSearch =
            String(item.id ?? "").includes(search) ||
            String(item.username ?? "").includes(search) ||
            String(item.product_name ?? "").includes(search) ||
            (item.payment_method ?? "").toLowerCase().includes(search.toLowerCase())
        const matchesMethod = filterMethod === "all" || item.payment_method === filterMethod
        return matchesSearch && matchesMethod
    })

    const totalRevenue = Orders.order.reduce((sum, o) => sum + Number(o.total_price), 0)
    const totalShipping = Orders.order.reduce((sum, o) => sum + Number(o.shipping_price), 0)

    return (
        <div className="p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
                <span className="text-sm text-gray-500">{Orders.order.length} total orders</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white shadow-md rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{Orders.order.length}</p>
                </div>
                <div className="bg-white shadow-md rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-yellow-500">Rs {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white shadow-md rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-1">Total Shipping Collected</p>
                    <p className="text-3xl font-bold text-gray-800">Rs {totalShipping.toLocaleString()}</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by Order ID, User, Product or Payment Method..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 min-w-[180px]"
                >
                    {paymentMethods.map((m) => (
                        <option key={m} value={m}>
                            {m === "all" ? "All Payment Methods" : m}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                {loading ? (
                    <div className="flex justify-center items-center p-12 text-gray-500">
                        Loading orders...
                    </div>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="p-3 text-gray-700">Order ID</th>
                                <th className="p-3 text-gray-700">Customer Name</th>
                                <th className="p-3 text-gray-700">Product Name</th>
                                <th className="p-3 text-gray-700">Payment Method</th>
                                <th className="p-3 text-gray-700">Total Price</th>
                                <th className="p-3 text-gray-700">Shipping</th>
                                <th className="p-3 text-gray-700">Receipt</th>
                                <th className="p-3 text-gray-700">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((item) => (
                                <tr
                                    onClick={() => router.push(`/Admin/orders/${item.id}`)}
                                    key={item.id} className="border-t hover:bg-gray-50 cursor-pointer">
                                    <td className="p-3 font-medium text-gray-800">#{item.id}</td>
                                    <td className="p-3 text-gray-600">{item.username}</td>
                                    <td className="p-3 text-gray-600">{item.product_name}</td>
                                    <td className="p-3">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                                            {item.payment_method}
                                        </span>
                                    </td>
                                    <td className="p-3 font-semibold text-gray-800">
                                        Rs {Number(item.total_price).toLocaleString()}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        Rs {Number(item.shipping_price).toLocaleString()}
                                    </td>
                                    <td className="p-3">
                                        {item.payment_receipt?.url ? (
                                            <a
                                                href={item.payment_receipt.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                View Receipt
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">None</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-gray-500 text-sm">
                                        {new Date(item.created_at).toLocaleDateString("en-PK", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center p-10 text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <PackageSearch size={36} />
                                            <p>No orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>



    )
}

export default OrdersPage