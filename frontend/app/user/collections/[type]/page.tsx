"use client";
import React from "react";
import Link from "next/link";
import {
    ChevronLeft, ChevronRight, Tag, ArrowRight,
    ShoppingBag, Info, Star, Loader2, Sparkles
} from "lucide-react";

interface PageProps {
    params: Promise<{ type: string }>;
}

function ImageCarousel({ images, name }: { images: { url: string }[], name: string }) {
    const [current, setCurrent] = React.useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-3 border-b border-gray-100">
                <ShoppingBag className="h-12 w-12 opacity-20" />
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">No Preview Available</p>
            </div>
        );
    }

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full h-[380px] overflow-hidden group border-b border-gray-50">
            <img
                src={images[current].url}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Visual Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:bg-white text-gray-800"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:bg-white text-gray-800"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/40 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Badge */}
            <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-widest text-[#B9974F] flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> New Arrival
                </div>
            </div>
        </div>
    );
}

export default function ClothesPage({ params }: PageProps) {
    const { type } = React.use(params);
    const lowerType = type.toLowerCase();

    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/user`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const result = await res.json();
            console.log(result);

            const filtered = (Array.isArray(result) ? result : []).filter(
                (item: any) => item.type.toLowerCase() === lowerType
            );

            setProducts(filtered);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
                <Loader2 className="h-10 w-10 text-[#B9974F] animate-spin" />
                <p className="text-sm font-medium tracking-widest uppercase text-gray-400">Restocking collections...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto py-16 px-4 md:px-10 lg:px-20 max-w-7xl">

                {/* Header Section */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="h-[1px] w-8 bg-[#B9974F]"></span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B9974F]">Premium Collection</span>
                        <span className="h-[1px] w-8 bg-[#B9974F]"></span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold capitalize text-gray-900 mb-4 tracking-tight leading-tight">
                        {lowerType} <span className="font-light italic text-[#B9974F]">Designs</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
                        Discover our exclusively curated {lowerType} collection. Each piece is crafted with precision to bring you the finest in modern ethnic fashion.
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {products.map((product: any) => (
                            <Link
                                href={`/user/collections/${type}/${product.id}`}
                                key={product.id}
                                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[#B9974F]/5 transition-all duration-500 overflow-hidden flex flex-col border border-gray-100"
                            >
                                <ImageCarousel images={product.images || []} name={product.name} />

                                {/* Product Details */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{product.brand}</span>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#B9974F] transition-colors leading-tight">{product.name}</h2>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-extrabold text-gray-900 leading-none">
                                                {product.after_discou && Number(product.after_discou) < Number(product.price) ? (
                                                    <span className="flex flex-col items-end gap-1">
                                                        <span className="text-[#B9974F]">
                                                            {product.currency === "PKR" ? "Rs. " : product.currency === "USD" ? "$ " : ""}
                                                            {Number(product.after_discou).toLocaleString()}
                                                        </span>
                                                        <span className="text-[10px] line-through text-gray-300 font-medium italic">
                                                            {Number(product.price).toLocaleString()}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <>
                                                        {product.currency === "PKR" ? "Rs. " : product.currency === "USD" ? "$ " : ""}
                                                        {Number(product.price).toLocaleString()}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">
                                        {product.description || `Luxury ${product.category} ${product.type} wear by ${product.brand}.`}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center justify-between py-4 border-t border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="h-3 w-3 text-[#B9974F]" /> {product.category}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {product.stock > 10 ? (
                                                    <span className="text-emerald-500 flex items-center gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-sm" /> Available
                                                    </span>
                                                ) : product.stock > 0 ? (
                                                    <span className="text-amber-500 flex items-center gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-amber-500 shadow-sm" /> Limited Stock
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-500 flex items-center gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-rose-500 shadow-sm" /> Out Of Stock
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="w-full bg-[#B9974F] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#B9974F]/20 group-hover:bg-[#a68846] transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                                        >
                                            View Details
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl shadow-sm border border-gray-50 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-[#FAF9F7] rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-8 h-8 text-[#B9974F] opacity-40" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Collection Coming Soon</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            We are currently curating the perfect {lowerType} selections for you. Stay tuned for our next seasonal launch!
                        </p>
                        <Link
                            href="/#collections"
                            className="text-[#B9974F] font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Return to Homepage <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}