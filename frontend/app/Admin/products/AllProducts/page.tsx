"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    type: string;
}

const AllProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleEdit = async (id: number) => {

    }


    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    All Products
                </h1>

                <Link
                    href="/admin/products"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow"
                >
                    + Add Product
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Brand</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-3">{product.id}</td>
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.brand}</td>
                                <td className="p-3">{product.category}</td>
                                <td className="p-3">{product.type}</td>
                                <td className="p-3">Rs {product.price}</td>
                                <td className="p-3">{product.stock}</td>
                                <td className="p-3">{product.status}</td>

                                <td className="p-3 flex justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(product.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                                        Edit
                                    </button>

                                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="text-center p-6 text-gray-500"
                                >
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllProducts;