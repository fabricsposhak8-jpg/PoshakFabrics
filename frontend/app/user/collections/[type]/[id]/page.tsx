"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

function ImageCarousel({ images, name }: { images: { url: string }[], name: string }) {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 md:h-96 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
                No Image
            </div>
        );
    }

    const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow mb-4 group">
            <img
                src={images[current].url}
                alt={`${name} ${current + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {images.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-colors">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

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

                // Safely parse JSON fields if they come back as strings
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
            <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
                Loading product details...
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg border border-gray-200 mt-8">

            {/* Image Carousel */}
            <ImageCarousel images={product.images || []} name={product.name} />

            {/* Product Title & Price */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
                <span className="text-xl font-semibold text-green-600">{product.price} {product.currency}</span>
            </div>

            {/* Stock & Basic Info */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 text-sm">
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p>
                    <strong>Status:</strong>{" "}
                    <span className={`${product.status === "active" ? "text-green-600" : "text-red-500"} font-medium`}>
                        {product.status}
                    </span>
                </p>
                <p><strong>Type:</strong> {product.type}</p>
                <p>
                    <strong>Stock:</strong>{" "}
                    {product.stock > 0 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium text-xs">In Stock</span>
                    ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium text-xs">Out of Stock</span>
                    )}
                </p>
            </div>

            {/* Description */}
            <div className="mt-4 text-gray-700">
                <h2 className="text-xl font-semibold mb-2">Description:</h2>
                <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm text-sm">{product.description || "No description available."}</p>
            </div>

            {/* Fabric Details */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Fabric Details:</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 list-disc ml-4 text-sm">
                    {product.fabric_details && product.fabric_details.length > 0 ? (
                        product.fabric_details.map((f: any, i: number) => (
                            <li key={i} className="text-gray-700 hover:text-blue-600 transition-colors">
                                <span className="font-medium">{f.key}:</span> {f.value}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No fabric details available</li>
                    )}
                </ul>
            </div>

            {/* Call to Action */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5
            ${added
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : product.stock === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-[#B9974F] hover:shadow-lg"
                        }`}
                >
                    {added ? <CheckCircle size={16} /> : <ShoppingCart size={16} />}
                    {added ? "Added" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <Link
                    href="/#contact"
                    className="inline-block bg-[#B9974F] text-white px-5 py-2 rounded-xl font-medium shadow-md hover:bg-[#a0833e] transition-all hover:-translate-y-0.5 text-sm"
                >
                    Contact Us
                </Link>
            </div>
        </div>
    );
};

export default UserProductView;