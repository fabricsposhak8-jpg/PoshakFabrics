"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Tag } from "lucide-react";

export default function CollectionsPreview() {
    const [products, setProducts] = useState<any[]>([]);
    const [activeType, setActiveType] = useState("stitched");
    const [loading, setLoading] = useState(true);
    const [touchedProducts, setTouchedProducts] = useState<number[]>([]);

    const handlecollection = async (type: string) => {
        setActiveType(type);
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/user`
            );
            const filtered = response.data.filter((item: any) => item.type === type);

            // Parse images if string
            const parsed = filtered.map((p: any) => ({
                ...p,
                images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
            }));

            setProducts(parsed.slice(0, 4));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handlecollection("stitched");
    }, []);

    return (
        <section className="py-16 px-4">
            <div id="collections" className="max-w-5xl mx-auto scroll-mt-24">

                {/* Heading */}
                <div className="text-center mb-12">
                    <span className="inline-block text-[#B9974F] text-sm font-semibold tracking-widest uppercase mb-2">
                        Curated For You
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Our Collections</h2>
                    <p className="text-gray-500 max-w-md mx-auto text-sm">
                        Handcrafted with passion — explore our finest stitched and unstitched pieces.
                    </p>
                </div>

                {/* Toggle Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="flex bg-gray-100 rounded-full p-1 gap-1">
                        {["stitched", "unstitched"].map((type) => (
                            <button
                                key={type}
                                onClick={() => handlecollection(type)}
                                className={`px-7 py-2.5 rounded-full cursor-pointer text-sm font-semibold transition-all duration-300 capitalize ${activeType === type
                                    ? "bg-[#B9974F] text-white shadow-md scale-105"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-gray-200 animate-pulse h-72" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-center col-span-full">
                        <Tag className="w-12 h-12 text-[#B9974F] opacity-50 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 text-sm">We currently don't have any {activeType} products available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product: any) => (
                            <div
                                key={product.id}
                                onClick={() => {
                                    const id = Number(product.id);
                                    setTouchedProducts((prev) =>
                                        prev.includes(id)
                                            ? prev.filter((pid) => pid !== id)
                                            : [...prev, id]
                                    );
                                }}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100 cursor-pointer"
                            >
                                {/* Image */}
                                <div className="relative w-full h-56 overflow-hidden rounded-t-2xl">
                                    <img
                                        src={product.images?.[0]?.url || "/placeholder.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                    {/* Floating price tag */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1 flex flex-col gap-1 shadow-sm text-xs">
                                        <div className="flex items-center gap-1">
                                            <Tag size={12} className="text-[#B9974F]" />
                                            {product.discount_perc > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-gray-400 line-through">
                                                        {product.currency === "PKR"
                                                            ? `Rs.${product.price}`
                                                            : product.currency === "USD"
                                                                ? `$${product.price}`
                                                                : `${product.price} ${product.currency}`}
                                                    </span>
                                                    <span className="font-semibold text-gray-800">
                                                        {product.currency === "PKR"
                                                            ? `Rs.${product.after_discou}`
                                                            : product.currency === "USD"
                                                                ? `$${product.after_discou}`
                                                                : `${product.after_discou} ${product.currency}`}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-gray-800">
                                                    {product.currency === "PKR"
                                                        ? `Rs.${product.price}`
                                                        : product.currency === "USD"
                                                            ? `$${product.price}`
                                                            : `${product.price} ${product.currency}`}
                                                </span>
                                            )}
                                        </div>
                                        {product.discount_perc > 0 && (
                                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full mt-1">
                                                {product.discount_perc}% Off
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover CTA overlay */}
                                    <div
                                        className={`absolute inset-x-0 bottom-0 transition-transform duration-300 p-3 ${touchedProducts.includes(Number(product.id))
                                            ? "translate-y-0"
                                            : "translate-y-full group-hover:translate-y-0"
                                            }`}
                                    >
                                        <Link
                                            href={`/user/collections/${activeType}/${product.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="block w-full text-center bg-white text-[#B9974F] font-semibold py-2 rounded-xl text-xs shadow hover:bg-[#B9974F] hover:text-white transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-gray-500 text-xs mt-1 capitalize">{product.category}</p>

                                    {/* Stock badge */}
                                    <div className="mt-3">
                                        {product.stock > 0 ? (
                                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-10 flex justify-center">
                    <Link
                        href={`/user/collections/${activeType}`}
                        className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#B9974F] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#a0833e] hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                        View All {activeType.charAt(0).toUpperCase() + activeType.slice(1)} Collection
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}