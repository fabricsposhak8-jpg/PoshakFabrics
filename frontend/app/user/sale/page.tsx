"use client";
import { useEffect, useState } from "react";
import { SaleData } from "../../page";
import { Star, Tag, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function SalePage() {

    const [sale, setSale] = useState<SaleData[] | null>(null);

    useEffect(() => {
        const fetchSale = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/getsale`);
            const data = await res.json();
            if (data && data.response) {
                setSale(data.response);
            }
        };
        fetchSale();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* ── Page Header & Banner ── */}
            <div className="relative h-60 md:h-80 w-full overflow-hidden mb-12">
                <img
                    src="/Home1.png"
                    className="w-full h-full object-cover object-top brightness-[0.4]"
                    alt="Sale Banner"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-6 h-6 text-[#C19344]" />
                        <span className="text-[#C19344] font-bold tracking-[0.2em] uppercase text-sm md:text-base">Limited Time Offer</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tight">
                        THE <span className="text-[#C19344]">EXCLUSIVE</span> SALE
                    </h1>
                    <p className="text-gray-300 max-w-lg text-sm md:text-base font-medium">
                        Unveil premium fabrics at unprecedented prices. Elevate your collection with our handcrafted masterpieces.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                {/* ── Filters/Sort Bar (Placeholder for now) ── */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Featured Offers</h2>
                        <p className="text-gray-500 text-sm mt-1">Showing {sale?.length || 0} products currently on promotion</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 font-medium">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>Top Rated</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 font-medium">
                            <ShoppingBag className="w-4 h-4 text-[#C19344]" />
                            <span>Popular</span>
                        </div>
                    </div>
                </div>

                {/* ── Product Grid ── */}
                {!sale ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C19344]"></div>
                    </div>
                ) : sale.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Tag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">No active sales right now</h3>
                        <p className="text-gray-500 mt-2">Check back soon for our exclusive seasonal offers.</p>
                        <Link href="/" className="inline-block mt-6 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-[#C19344] transition-all">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {sale.filter(p => p.product_id).map((product) => {
                            const original = parseFloat(product.price || "0");
                            const discount = product.sale_discount_percentage || 0;
                            const finalPrice = original - (original * discount / 100);

                            return (
                                <div
                                    key={product.product_id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full overflow-hidden"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-72 md:h-80 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={product.images?.[0]?.url || "/Home1.png"}
                                            className="h-full w-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                                            alt={product.name}
                                        />

                                        {/* Luxury Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Link
                                                href={`/user/collections/${product.type}/${product.product_id}`}
                                                className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                                            >
                                                Quick View
                                            </Link>
                                        </div>

                                        {/* Sale Badge */}
                                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                            <Tag className="w-3 h-3" />
                                            {discount}% OFF
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] text-[#C19344] uppercase font-black tracking-[0.2em]">
                                                {product.brand}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                                                <span>4.8</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#C19344] transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>

                                        {/* Price Section */}
                                        <div className="mt-auto flex items-baseline gap-3">
                                            <span className="text-2xl font-black text-gray-900">
                                                Rs.{finalPrice.toLocaleString()}
                                            </span>
                                            <span className="text-sm line-through text-gray-400 font-medium">
                                                Rs.{original.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={`/user/collections/${product.type}/${product.product_id}`}
                                            className="mt-6 w-full py-3 text-center text-sm font-black rounded-xl bg-gray-900 text-white hover:bg-[#C19344] transform active:scale-95 transition-all duration-300 shadow-lg shadow-gray-200"
                                        >
                                            SELECT OPTIONS
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}