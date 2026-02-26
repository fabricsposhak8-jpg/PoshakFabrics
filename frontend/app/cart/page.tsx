"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from "lucide-react";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

    console.log("totalItems", totalItems);
    console.log("totalPrice", totalPrice);
    const formatPrice = (price: number, currency: string) => {
        if (currency === "PKR") return `Rs. ${price.toLocaleString()}`;
        if (currency === "USD") return `$${price.toFixed(2)}`;
        return `${price} ${currency}`;
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                    <ShoppingBag size={44} className="text-[#B9974F]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Looks like you haven&apos;t added anything yet. Explore our premium collections!
                </p>
                <Link
                    href="/user/collections/stitched"
                    className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#B9974F] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <ArrowLeft size={18} />
                    Browse Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-500 mt-1">
                        {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                    </p>
                </div>
                <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                >
                    <Trash2 size={14} />
                    Clear All
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-1 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                            {/* Icon Badge */}
                            <div className="w-16 h-16 rounded-xl bg-amber-50 flex-shrink-0 flex items-center justify-center">
                                <Tag size={28} className="text-[#B9974F]" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-gray-800 truncate">{item.name}</h2>
                                <p className="text-sm text-gray-500">{item.brand} &bull; {item.category} &bull; {item.type}</p>
                                <p className="text-[#B9974F] font-semibold mt-1">
                                    {formatPrice(item.price, item.currency)}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-semibold text-gray-800">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            {/* Subtotal + Remove */}
                            <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                                <span className="font-bold text-gray-800 text-lg">
                                    {formatPrice(item.price * item.quantity, item.currency)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Continue Shopping */}
                    <Link
                        href="/user/collections/stitched"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mt-2 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Continue Shopping
                    </Link>
                </div>

                {/* Order Summary */}
                <div className="lg:w-80">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Order Summary</h2>

                        <div className="space-y-3 text-sm text-gray-600 mb-5">
                            <div className="flex justify-between">
                                <span>Subtotal ({totalItems} items)</span>
                                <span className="font-medium text-gray-800">
                                    {cart[0]?.currency === "PKR"
                                        ? `Rs. ${totalPrice.toLocaleString()}`
                                        : `$${totalPrice.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">To be discussed</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                                <span>Estimated Total</span>
                                <span className="text-[#B9974F]">
                                    {cart[0]?.currency === "PKR"
                                        ? `Rs. ${totalPrice.toLocaleString()}`
                                        : `$${totalPrice.toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        {/* Checkout via WhatsApp / Contact */}
                        <Link
                            href="/#contact"
                            className="w-full block text-center bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-[#B9974F] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Place Order via Contact
                        </Link>

                        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                            We&apos;ll confirm your order via WhatsApp or phone after you contact us.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}