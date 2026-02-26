"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, CheckCircle } from "lucide-react";

const UserProductView = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/user/${id}`);
                setProduct(res.data);
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

    if (!product) return <div className="flex justify-center items-center h-screen text-gray-500 text-lg">Loading product details...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 mt-10">

            {/* Product Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{product.name}</h1>
                <span className="text-xl font-semibold text-green-600">{product.price} {product.currency}</span>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-gray-700">
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Status:</strong> <span className={`${product.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>{product.status}</span></p>
            </div>

            {/* Description */}
            <div className="mt-6 text-gray-700">
                <h2 className="text-2xl font-semibold mb-2">Description:</h2>
                <p className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">{product.description || "No description provided."}</p>
            </div>

            {/* Fabric Details */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Fabric Details:</h2>
                <ul className="list-disc ml-6 space-y-1">
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
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5
                        ${added
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : product.stock === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-[#B9974F] hover:shadow-lg"
                        }`}
                >
                    {added ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
                    {added ? "Added to Cart!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <p className="text-gray-700 text-sm">For booking, send a message on Contact us or call us.</p>
                <Link
                    href="/#contact"
                    className="inline-block bg-[#B9974F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#a0833e] shadow-md transition-all hover:-translate-y-0.5"
                >
                    Contact Us
                </Link>
            </div>
        </div>
    );
};

export default UserProductView;
