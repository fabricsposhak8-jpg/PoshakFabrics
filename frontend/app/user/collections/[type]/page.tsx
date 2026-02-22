"use client";
import React from "react";
import axios from "axios";

interface PageProps {
    params: Promise<{ type: string }>;
}

export default function ClothesPage({ params }: PageProps) {
    const { type } = React.use(params);
    const lowerType = type.toLowerCase();

    const [products, setProducts] = React.useState<any[]>([]);

    const fetchProducts = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/api/products/user`);
            const filtered = result.data.filter(
                (item: any) => item.type.toLowerCase() === lowerType
            );
            setProducts(filtered);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="mx-auto py-10 ml-10">
            <h1 className="text-3xl font-bold capitalize mb-6">
                {lowerType} Collection
            </h1>

            {lowerType === "stitched" && (
                <p className="mb-6 text-gray-700">Showing all stitched clothes.</p>
            )}
            {lowerType === "unstitched" && (
                <p className="mb-6 text-gray-700">Showing all unstitched clothes.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: any) => (
                    <div
                        key={product._id}
                        className="bg-white border rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                            <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                            <p className="text-gray-700 mb-2">{product.description}</p>

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

                            {/* Fabric Details */}
                            <div className="mt-2">
                                <p className="font-semibold mb-1">Fabric Details:</p>
                                <ul className="list-disc list-inside text-gray-700 text-sm">
                                    {product.fabric_details && product.fabric_details.length > 0 ? (
                                        product.fabric_details.map((fabric: any, index: number) => (
                                            <li key={index}>
                                                {fabric.key} : {fabric.value}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No fabric details available</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Stock Badge */}
                        <div className="mt-4">
                            {product.stock > 0 ? (
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    In Stock
                                </span>
                            ) : (
                                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 &&
                (lowerType === "stitched" || lowerType === "unstitched") && (
                    <p className="mt-4 text-gray-500">
                        No products found in this collection.
                    </p>
                )}

            {lowerType !== "stitched" && lowerType !== "unstitched" && (
                <p className="mt-4 text-red-500">Invalid collection type.</p>
            )}
        </div>
    );
}