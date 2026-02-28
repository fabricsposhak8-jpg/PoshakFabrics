"use client";
import React from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
    params: Promise<{ type: string }>;
}

function ImageCarousel({ images, name }: { images: { url: string }[], name: string }) {
    const [current, setCurrent] = React.useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No Image
            </div>
        );
    }

    const nextImage = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div className="relative w-full h-80 overflow-hidden">
            <img
                src={images[current].url}
                alt={name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
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
            const result = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/user`
            );

            const filtered = result.data.filter(
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
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-xl font-semibold animate-pulse">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto py-10 px-4 md:px-10 lg:px-20">
            <h1 className="text-3xl font-bold capitalize mb-6">{lowerType} Collection</h1>

            {lowerType === "stitched" && <p className="mb-6 text-gray-700">Showing all stitched clothes.</p>}
            {lowerType === "unstitched" && <p className="mb-6 text-gray-700">Showing all unstitched clothes.</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                    <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                    >

                        <ImageCarousel images={product.images || []} name={product.name} />

                        {/* Product Details */}
                        <div className="p-4 flex flex-col flex-1 justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-1">{product.name}</h2>
                                <p className="text-gray-600 text-sm mb-1">{product.brand}</p>
                                <p className="text-gray-700 mb-2 line-clamp-3">{product.description}</p>

                                <p className="font-semibold mb-1">
                                    Price:{" "}
                                    {product.currency === "PKR"
                                        ? `Rs.${product.price}`
                                        : product.currency === "USD"
                                            ? `$${product.price}`
                                            : `${product.price} ${product.currency}`}
                                </p>

                                <p className="text-gray-600 mb-1">Category: {product.category}</p>
                                <p className="text-gray-600 mb-2">Type: {product.type}</p>
                            </div>

                            {/* Stock Badge */}
                            <div className="flex justify-between items-center mt-4">
                                {product.stock > 0 ? (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                        Out of Stock
                                    </span>
                                )}

                                <Link
                                    href={`/user/collections/${type}/${product.id}`}
                                    className="inline-block bg-[#B9974F] text-white px-4 py-1 rounded hover:bg-[#B9974F] transition-colors text-sm"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 &&
                (lowerType === "stitched" || lowerType === "unstitched") && (
                    <p className="mt-6 text-gray-500">No products found in this collection.</p>
                )}

            {lowerType !== "stitched" && lowerType !== "unstitched" && (
                <p className="mt-6 text-red-500">Invalid collection type.</p>
            )}
        </div>
    );
}