"use client"
import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const page = () => {

    const [product, setproduct] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        currency: "PKR",
        description: "",
        stock: "",
        status: "active",
        type: "",
    })

    const [fabric_details, setfabric_details] = useState([
        { key: "", value: "" }
    ])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newProduct = { ...product, fabric_details }

        try {
            const response = await axios.post("http://localhost:5000/api/products/add", newProduct)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }


        console.log(newProduct)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setproduct({ ...product, [e.target.name]: e.target.value })
    }

    const addDetail = () => {
        setfabric_details([...fabric_details, { key: "", value: "" }])
    }

    const handleChangedetails = (index: number, field: "key" | "value", val: string) => {
        const newDetails = [...fabric_details]
        newDetails[index][field] = val
        setfabric_details(newDetails)
    }

    const removeDetail = (index: number) => {
        const newDetails = [...fabric_details]
        newDetails.splice(index, 1)
        setfabric_details(newDetails)
    }

    return (
        <div className='max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Add Product</h1>
            <div className="flex justify-end mb-6">
                <Link
                    href="/Admin/products/AllProducts"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200"
                >
                    View All Products
                </Link>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>

                {/* Basic Product Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Name' name='name' value={product.name} onChange={handleChange} />
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Brand' name='brand' value={product.brand} onChange={handleChange} />
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Category' name='category' value={product.category} onChange={handleChange} />
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Price' name='price' value={product.price} onChange={handleChange} />

                    <select className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' name="currency" value={product.currency} onChange={handleChange}>
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                    </select>

                    <select className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' name="type" value={product.type} onChange={handleChange}>
                        <option value="Stiched">Stiched</option>
                        <option value="Unstiched">Unstiched</option>
                    </select>

                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Stock' name='stock' value={product.stock} onChange={handleChange} />

                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Status' name='status' value={product.status} onChange={handleChange} />
                </div>

                <textarea className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' placeholder='Product Description' name='description' value={product.description} onChange={handleChange} />

                {/* Product Details */}
                <div>
                    <h2 className='text-xl font-semibold mb-2'>Product Details</h2>
                    <div className='space-y-4'>
                        {fabric_details.map((detail, index) => (
                            <div key={index} className='flex flex-col md:flex-row gap-2 items-center'>
                                <input
                                    className='border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                                    type="text"
                                    placeholder='Detail Key'
                                    value={detail.key}
                                    onChange={(e) => handleChangedetails(index, "key", e.target.value)}
                                />
                                <input
                                    className='border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                                    type="text"
                                    placeholder='Detail Value'
                                    value={detail.value}
                                    onChange={(e) => handleChangedetails(index, "value", e.target.value)}
                                />
                                <button
                                    type="button"
                                    className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition'
                                    onClick={() => removeDetail(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className='bg-[#3A8588] text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                            onClick={addDetail}
                        >
                            Add Detail
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type='submit'
                    className='bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition w-full md:w-auto'
                >
                    Add Product
                </button>
            </form>
        </div>
    )
}

export default page