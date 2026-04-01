"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
    Plus, Search, Edit, Trash2, AlertTriangle, 
    CheckCircle2, Package, X, Loader2
} from "lucide-react";

interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    type: string;
    after_discou: number;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const AllProducts = () => {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: number | null }>({
        isOpen: false,
        productId: null
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {
        if (token) fetchProducts();  // only fetch when token is available
    }, [token]);

    const handleDeleteConfirm = async () => {
        if (!deleteModal.productId) return;
        
        setIsDeleting(true);
        try {
            await axios.delete(`${API}/api/products/${deleteModal.productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage("Product deleted successfully.");
            setTimeout(() => setSuccessMessage(""), 3000);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, productId: null });
        }
    };

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-6 w-6 text-[#B9974F]" />
                            All Products
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your product catalog and inventory</p>
                    </div>

                    <Link
                        href="/Admin/products"
                        className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#B9974F] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4" /> Add Product
                    </Link>
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

                {/* Search / Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-3">
                    <Search className="h-5 w-5 text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Search products by name, brand or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-gray-800 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Price</th>
                                    <th className="px-6 py-4 font-semibold">Stock</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-[#B9974F]" />
                                            <p>Loading products...</p>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            <Package className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                                            <p className="text-gray-500 font-medium">No products found</p>
                                            <p className="text-xs mt-1">Try adjusting your search or add a new product.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800">{product.name}</span>
                                                    <span className="text-xs text-gray-400">{product.brand || 'No Brand'} • {product.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{product.after_discou || product.price} Rs</span>
                                                    {product.after_discou && product.after_discou < product.price && (
                                                        <span className="text-xs text-red-400 line-through">{product.price} Rs</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-200' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${product.status?.toLowerCase() === 'active' ? 'bg-[#B9974F]/10 text-[#B9974F]' : 'bg-gray-100 text-gray-500'}`}>
                                                    {product.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/Admin/products/edit/${product.id}`)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ isOpen: true, productId: product.id })}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
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
                            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-[modalIn_0.2s_ease-out]"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </p>
                                
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: false, productId: null })}
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

export default AllProducts;