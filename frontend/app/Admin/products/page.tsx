"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { X, ImagePlus } from 'lucide-react'

const page = () => {

    const [success, setsuccess] = useState(false)
    const [token, setToken] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const [product, setproduct] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        currency: "PKR",
        description: "",
        stock: "",
        status: "active",
        type: "stitched",
    })

    const [fabric_details, setfabric_details] = useState([
        { key: "", value: "" }
    ])

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const combined = [...images, ...files].slice(0, 5); // max 5 images
        setImages(combined);
        setPreviews(combined.map((f) => URL.createObjectURL(f)));
    }

    const removeImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
        setPreviews(updated.map((f) => URL.createObjectURL(f)));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()

        // Append product fields
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value)
        })

        // Append fabric_details as JSON string
        formData.append("fabric_details", JSON.stringify(fabric_details))

        // Append each image file
        images.forEach((img) => {
            formData.append("images", img)
        })

        try {
            const response = await axios.post(
                "http://localhost:5000/api/products/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            )

            if (response.status === 200) {
                setproduct({
                    name: "",
                    brand: "",
                    category: "",
                    price: "",
                    currency: "PKR",
                    description: "",
                    stock: "",
                    status: "active",
                    type: "stitched",
                })
                setfabric_details([{ key: "", value: "" }])
                setImages([])
                setPreviews([])
                setsuccess(true)
                setTimeout(() => setsuccess(false), 2500)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const t = localStorage.getItem("token")
        if (t) setToken(t)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setproduct({ ...product, [e.target.name]: e.target.value })
    }

    const addDetail = () => setfabric_details([...fabric_details, { key: "", value: "" }])

    const handleChangedetails = (index: number, field: "key" | "value", val: string) => {
        const updated = [...fabric_details]
        updated[index][field] = val
        setfabric_details(updated)
    }

    const removeDetail = (index: number) => {
        setfabric_details(fabric_details.filter((_, i) => i !== index))
    }

    return (
        <div className='max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Add Product</h1>

            {success && (
                <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center">
                    ✅ Product added successfully!
                </div>
            )}

            <div className="flex justify-end mb-6">
                <Link href="/Admin/products/AllProducts" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200">
                    View All Products
                </Link>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>

                {/* Basic Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Product Name' name='name' value={product.name} onChange={handleChange} required />
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Brand' name='brand' value={product.brand} onChange={handleChange} />
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="text" placeholder='Category' name='category' value={product.category} onChange={handleChange} />
                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="number" placeholder='Price' name='price' value={product.price} onChange={handleChange} required />

                    <select className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' name="currency" value={product.currency} onChange={handleChange}>
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                    </select>

                    <select className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' name="type" value={product.type} onChange={handleChange}>
                        <option value="stitched">Stitched</option>
                        <option value="unstitched">Unstitched</option>
                    </select>

                    <input className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' type="number" placeholder='Stock' name='stock' value={product.stock} onChange={handleChange} />

                    <select className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' name="status" value={product.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <textarea className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]' placeholder='Product Description' name='description' value={product.description} onChange={handleChange} />

                {/* Image Upload */}
                <div>
                    <h2 className='text-xl font-semibold mb-3'>Product Images <span className='text-sm text-gray-400 font-normal'>(max 5)</span></h2>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div className='flex flex-wrap gap-3 mb-4'>
                            {previews.map((src, i) => (
                                <div key={i} className='relative w-24 h-24 rounded-lg overflow-hidden border shadow-sm group'>
                                    <img src={src} alt={`preview-${i}`} className='w-full h-full object-cover' />
                                    <button
                                        type='button'
                                        onClick={() => removeImage(i)}
                                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity'
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    {images.length < 5 && (
                        <label className='cursor-pointer inline-flex items-center gap-2 border-2 border-dashed border-gray-300 px-5 py-3 rounded-lg text-gray-500 hover:border-yellow-500 hover:text-yellow-600 transition'>
                            <ImagePlus size={20} />
                            <span>Select Images ({images.length}/5)</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className='hidden'
                                onChange={handleImageChange}
                            />
                        </label>
                    )}
                </div>

                {/* Fabric Details */}
                <div>
                    <h2 className='text-xl font-semibold mb-2'>Fabric Details</h2>
                    <div className='space-y-3'>
                        {fabric_details.map((detail, index) => (
                            <div key={index} className='flex flex-col md:flex-row gap-2 items-center'>
                                <input
                                    className='border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                                    type="text"
                                    placeholder='Key (e.g. Material)'
                                    value={detail.key}
                                    onChange={(e) => handleChangedetails(index, "key", e.target.value)}
                                />
                                <input
                                    className='border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                                    type="text"
                                    placeholder='Value (e.g. Cotton)'
                                    value={detail.value}
                                    onChange={(e) => handleChangedetails(index, "value", e.target.value)}
                                />
                                <button type="button" className='bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition' onClick={() => removeDetail(index)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" className='bg-[#3A8588] text-white px-4 py-2 rounded hover:bg-teal-600 transition' onClick={addDetail}>
                            + Add Detail
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button type='submit' className='bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition w-full md:w-auto'>
                    Add Product
                </button>

            </form>
        </div>
    )
}

export default page