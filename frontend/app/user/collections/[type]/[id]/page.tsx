"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import {
    ShoppingCart, CheckCircle, ChevronLeft, ChevronRight,
    X, ZoomIn, Tag, Layers, Info, Package
} from "lucide-react";

/* ─────────────────────────── Lightbox ─────────────────────────── */
function Lightbox({
    images, current, setCurrent, onClose,
}: {
    images: { url: string }[];
    current: number;
    setCurrent: (i: number) => void;
    onClose: () => void;
}) {
    const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(current === 0 ? images.length - 1 : current - 1); };
    const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(current === images.length - 1 ? 0 : current + 1); };

    useEffect(() => {
        // Lock background scroll
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") setCurrent(current === 0 ? images.length - 1 : current - 1);
            if (e.key === "ArrowRight") setCurrent(current === images.length - 1 ? 0 : current + 1);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [current]);

    const content = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close */}
            <button
                onClick={onClose}
                className="absolute top-5 right-5 bg-white/10 hover:bg-white/25 text-white p-2.5 rounded-full transition-colors z-10"
            >
                <X className="h-6 w-6" />
            </button>

            <div className="relative flex items-center justify-center w-full h-full px-16" onClick={e => e.stopPropagation()}>
                <img
                    src={images[current].url}
                    alt={`Image ${current + 1}`}
                    className="max-h-[88vh] max-w-[85vw] object-contain rounded-xl shadow-2xl select-none"
                />

                {images.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                            <ChevronLeft className="h-7 w-7" />
                        </button>
                        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                            <ChevronRight className="h-7 w-7" />
                        </button>

                        {/* Thumbnail strip */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-5 left-5 text-white/60 text-sm">{current + 1} / {images.length}</div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
}

/* ─────────────────────────── Main Gallery ─────────────────────────── */
function Gallery({ images, name }: { images: { url: string }[]; name: string }) {
    const [current, setCurrent] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-[4/5] bg-gray-100 flex flex-col items-center justify-center text-gray-400 rounded-2xl gap-2">
                <Package className="h-12 w-12 opacity-30" />
                <span className="text-sm">No Images Available</span>
            </div>
        );
    }

    const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(c => c === 0 ? images.length - 1 : c - 1); };
    const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent(c => c === images.length - 1 ? 0 : c + 1); };

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div
                className="relative w-full aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden cursor-zoom-in group border border-gray-100 shadow-sm"
                onClick={() => setLightbox(true)}
            >
                <img
                    src={images[current].url}
                    alt={`${name} ${current + 1}`}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Zoom badge */}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-700 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Zoom
                </div>

                {/* Nav arrows */}
                {images.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === current ? "border-[#B9974F] shadow-md scale-[1.05]" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {lightbox && (
                <Lightbox images={images} current={current} setCurrent={setCurrent} onClose={() => setLightbox(false)} />
            )}
        </div>
    );
}

/* ─────────────────────────── Page ─────────────────────────── */
const UserProductView = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/user/${id}`);
                const data = res.data;
                if (typeof data.fabric_details === "string") {
                    try { data.fabric_details = JSON.parse(data.fabric_details); } catch { data.fabric_details = []; }
                }
                if (typeof data.images === "string") {
                    try { data.images = JSON.parse(data.images); } catch { data.images = []; }
                }
                setProduct(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            currency: product.currency,
            type: product.type,
            category: product.category,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    if (!product)
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <div className="w-10 h-10 border-4 border-[#B9974F] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading product…</p>
            </div>
        );

    const isInStock = product.stock > 0;

    return (
        <div className="min-h-screen bg-[#FAF9F7]">
            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* ── Two-column layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    {/* LEFT – Gallery */}
                    <div className="lg:sticky lg:top-8">
                        <Gallery images={product.images || []} name={product.name} />
                    </div>

                    {/* RIGHT – Details */}
                    <div className="flex flex-col gap-6">

                        {/* Title & price */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isInStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                    {isInStock ? "In Stock" : "Out of Stock"}
                                </span>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${product.status === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                                    {product.status}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-snug mt-2">{product.name}</h1>
                            <p className="text-2xl font-bold text-[#B9974F] mt-2">
                                {Number(product.after_discou).toLocaleString()} <span className="text-base font-medium text-gray-400">{product.currency}</span>

                            </p>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Info grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: <Tag className="h-4 w-4 text-[#B9974F]" />, label: "Brand", value: product.brand },
                                { icon: <Layers className="h-4 w-4 text-[#B9974F]" />, label: "Category", value: product.category },
                                { icon: <Info className="h-4 w-4 text-[#B9974F]" />, label: "Type", value: product.type },
                            ].map(({ icon, label, value }) => (
                                <div key={label} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3 shadow-sm">
                                    {icon}
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{label}</p>
                                        <p className="text-sm font-semibold text-gray-800 capitalize">{value || "—"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h2>
                                <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Fabric Details */}
                        {product.fabric_details && product.fabric_details.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Fabric Details</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                    {product.fabric_details.map((f: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B9974F] flex-shrink-0" />
                                            <span><span className="font-semibold text-gray-800">{f.key}:</span> {f.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5
                                    ${added
                                        ? "bg-green-600 text-white"
                                        : !isInStock
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-900 text-white hover:bg-[#B9974F] hover:shadow-lg"
                                    }`}
                            >
                                {added ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
                                {added ? "Added to Cart!" : !isInStock ? "Out of Stock" : "Add to Cart"}
                            </button>

                            <Link
                                href={`/user/checkout/${product.id}`}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B9974F] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:bg-[#a0833e] transition-all hover:-translate-y-0.5"
                            >
                                Buy Now
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProductView;