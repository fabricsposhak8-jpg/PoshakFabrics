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

    console.log(touchedProducts);
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
        <section className="py-16 px-4 bg-gradient-to-b from-white to-[#fdf8f2]">
            <div className="max-w-5xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-10">
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
                                className={`px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 capitalize ${activeType === type
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {products.map((product: any) => (
                            <div
                                key={product.id}
                                onClick={() => {
                                    const id = Number(product.id);
                                    setTouchedProducts((prev) =>
                                        prev.includes(id)
                                            ? prev.filter((pid) => pid !== id) // remove if already touched (hide)
                                            : [...prev, id] // add if not touched (show)
                                    );
                                }}
                                className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 flex flex-col border border-gray-100`}
                            >
                                {/* Image */}
                                <div className="relative w-full h-52 overflow-hidden">
                                    <img
                                        src={product.images?.[0]?.url || "/placeholder.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Dark overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                    {/* Floating price tag */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                                        <Tag size={11} className="text-[#B9974F]" />
                                        <span className="text-xs font-semibold text-gray-800">
                                            {product.currency === "PKR"
                                                ? `Rs.${product.price}`
                                                : product.currency === "USD"
                                                    ? `$${product.price}`
                                                    : `${product.price} ${product.currency}`}
                                        </span>
                                    </div>

                                    {/* Hover CTA overlay */}
                                    <div
                                        className={`absolute inset-x-0 bottom-0 transition-transform duration-300 p-3 ${touchedProducts.includes(Number(product.id))
                                            ? "translate-y-0"        // always show if touched
                                            : "translate-y-full group-hover:translate-y-0" // slide up on hover if not touched
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
                                <div className="p-3 flex-1 flex flex-col">
                                    <h3 className="font-bold text-sm text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-gray-400 text-xs mt-0.5 capitalize">{product.category}</p>

                                    {/* Stock badge */}
                                    <div className="mt-2">
                                        {product.stock > 0 ? (
                                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">In Stock</span>
                                        ) : (
                                            <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Out of Stock</span>
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