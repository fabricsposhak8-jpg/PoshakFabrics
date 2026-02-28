"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { X, ImagePlus } from "lucide-react"

const EditPage = () => {

    const { id } = useParams()
    const router = useRouter()

    const [success, setSuccess] = useState(false)
    const [token, setToken] = useState("")

    // Existing images from DB
    const [existingImages, setExistingImages] = useState<{ url: string; cloudinary_id: string }[]>([])
    // New images to upload
    const [newImages, setNewImages] = useState<File[]>([])
    const [newPreviews, setNewPreviews] = useState<string[]>([])

    const [product, setProduct] = useState({
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

    const [fabric_details, setFabricDetails] = useState([{ key: "", value: "" }])

    // Load token
    useEffect(() => {
        const t = localStorage.getItem("token")
        if (t) setToken(t)
    }, [])

    // Fetch product
    useEffect(() => {
        if (!id || !token) return;

        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const data = res.data

                setProduct({
                    name: data.name || "",
                    brand: data.brand || "",
                    category: data.category || "",
                    price: data.price?.toString() || "",
                    currency: data.currency || "PKR",
                    description: data.description || "",
                    stock: data.stock?.toString() || "",
                    status: data.status || "active",
                    type: data.type || "stitched",
                })

                // Parse images if string
                const imgs = typeof data.images === "string" ? JSON.parse(data.images) : data.images;
                setExistingImages(imgs || [])

                // Parse fabric_details
                const fd = typeof data.fabric_details === "string" ? JSON.parse(data.fabric_details) : data.fabric_details;
                setFabricDetails(fd?.length > 0 ? fd : [{ key: "", value: "" }])

            } catch (error) {
                console.log("Fetch Error:", error)
            }
        }

        fetchProduct()
    }, [id, token])

    // Scroll to top on success
    useEffect(() => {
        if (success) window.scrollTo({ top: 0, behavior: "smooth" })
    }, [success])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }

    const handleChangedetails = (index: number, field: "key" | "value", val: string) => {
        const updated = [...fabric_details]
        updated[index][field] = val
        setFabricDetails(updated)
    }

    const addDetail = () => setFabricDetails([...fabric_details, { key: "", value: "" }])

    const removeDetail = (index: number) => {
        setFabricDetails(fabric_details.filter((_, i) => i !== index))
    }

    // New image handlers
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const combined = [...newImages, ...files].slice(0, 5);
        setNewImages(combined);
        setNewPreviews(combined.map((f) => URL.createObjectURL(f)));
    }

    const removeNewImage = (index: number) => {
        const updated = newImages.filter((_, i) => i !== index);
        setNewImages(updated);
        setNewPreviews(updated.map((f) => URL.createObjectURL(f)));
    }

    // Update product
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()

        Object.entries(product).forEach(([key, value]) => formData.append(key, value))
        formData.append("fabric_details", JSON.stringify(fabric_details))

        // Only append new images if selected; otherwise backend keeps existing
        newImages.forEach((img) => formData.append("images", img))

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/update/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            )

            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                router.push("/Admin/products/AllProducts")
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Edit Product</h1>

            {success && (
                <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center">
                    ✅ Product Updated Successfully!
                </div>
            )}

            <form onSubmit={handleUpdate} className='space-y-6'>

                {/* Basic Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product Name" className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' />
                    <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Brand" className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' />
                    <input type="text" name="category" value={product.category} onChange={handleChange} placeholder="Category" className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' />
                    <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' />

                    <select name="currency" value={product.currency} onChange={handleChange} className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500'>
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                    </select>

                    <select name="type" value={product.type} onChange={handleChange} className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500'>
                        <option value="stitched">Stitched</option>
                        <option value="unstitched">Unstitched</option>
                    </select>

                    <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Stock" className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500' />

                    <select name="status" value={product.status} onChange={handleChange} className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500'>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" className='border p-3 rounded w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-yellow-500' />

                {/* Images Section */}
                <div>
                    <h2 className='text-xl font-semibold mb-3'>Product Images</h2>

                    {/* Existing images */}
                    {existingImages.length > 0 && (
                        <div className="mb-3">
                            <p className="text-sm text-gray-500 mb-2">Current images (will be replaced if you upload new ones):</p>
                            <div className="flex flex-wrap gap-3">
                                {existingImages.map((img, i) => (
                                    <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border shadow-sm">
                                        <img src={img.url} alt={`existing-${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New image previews */}
                    {newPreviews.length > 0 && (
                        <div className="mb-3">
                            <p className="text-sm text-yellow-600 mb-2">New images (will replace current):</p>
                            <div className="flex flex-wrap gap-3">
                                {newPreviews.map((src, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border shadow-sm group">
                                        <img src={src} alt={`new-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload new images */}
                    {newImages.length < 5 && (
                        <label className="cursor-pointer inline-flex items-center gap-2 border-2 border-dashed border-gray-300 px-5 py-3 rounded-lg text-gray-500 hover:border-yellow-500 hover:text-yellow-600 transition">
                            <ImagePlus size={20} />
                            <span>Upload New Images ({newImages.length}/5)</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                {/* Fabric Details */}
                <div>
                    <h2 className='text-xl font-semibold mb-2'>Fabric Details</h2>
                    <div className="space-y-3">
                        {fabric_details.map((detail, index) => (
                            <div key={index} className='flex flex-col md:flex-row gap-2 items-center'>
                                <input type="text" value={detail.key} onChange={(e) => handleChangedetails(index, "key", e.target.value)} placeholder="Key (e.g. Material)" className='border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500' />
                                <input type="text" value={detail.value} onChange={(e) => handleChangedetails(index, "value", e.target.value)} placeholder="Value (e.g. Cotton)" className='border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-500' />
                                <button type="button" onClick={() => removeDetail(index)} className='bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition'>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addDetail} className='bg-[#3A8588] text-white px-4 py-2 rounded hover:bg-teal-600 transition'>
                            + Add Detail
                        </button>
                    </div>
                </div>

                <button type='submit' className='bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition w-full md:w-auto'>
                    Update Product
                </button>
            </form>
        </div>
    )
}

export default EditPage