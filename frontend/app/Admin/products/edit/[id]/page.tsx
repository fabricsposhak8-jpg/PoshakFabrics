"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

const EditPage = () => {

    const { id } = useParams()
    const router = useRouter()

    const [success, setSuccess] = useState(false)
    const [token, setToken] = useState("")

    const [product, setProduct] = useState({
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

    const [fabric_details, setFabricDetails] = useState([
        { key: "", value: "" }
    ])

    // 🔥 Load Token
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            setToken(storedToken)
        }
    }, [])
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = res.data

                console.log(data)

                setProduct({
                    name: data.name || "",
                    brand: data.brand || "",
                    category: data.category || "",
                    price: data.price?.toString() || "",
                    currency: data.currency || "PKR",
                    description: data.description || "",
                    stock: data.stock?.toString() || "",
                    status: data.status || "active",
                    type: data.type || "",
                })

                setFabricDetails(
                    data.fabric_details && data.fabric_details.length > 0
                        ? data.fabric_details
                        : [{ key: "", value: "" }]
                )

            } catch (error) {
                console.log("Fetch Error:", error)
            }
        }

        fetchProduct()

        if (success) {
            useEffect(() => {
                if (success) {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }
            }, [success])
        }

    }, [id, token])



    const handleChange = (e: any) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }

    const handleChangedetails = (index: number, field: "key" | "value", val: string) => {
        const updated = [...fabric_details]
        updated[index][field] = val
        setFabricDetails(updated)
    }

    const addDetail = () => {
        setFabricDetails([...fabric_details, { key: "", value: "" }])
    }

    const removeDetail = (index: number) => {
        const updated = [...fabric_details]
        updated.splice(index, 1)
        setFabricDetails(updated)
    }

    // 🔥 UPDATE PRODUCT
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/update/${id}`,
                { ...product, fabric_details },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
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
                <div className="bg-green-500 text-white px-4 py-2 rounded mb-4">
                    Product Updated Successfully
                </div>
            )}

            <form onSubmit={handleUpdate} className='space-y-6'>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type="text" name="name" value={product.name} onChange={handleChange} className='border p-3 rounded w-full' />
                    <input type="text" name="brand" value={product.brand} onChange={handleChange} className='border p-3 rounded w-full' />
                    <input type="text" name="category" value={product.category} onChange={handleChange} className='border p-3 rounded w-full' />
                    <input type="text" name="price" value={product.price} onChange={handleChange} className='border p-3 rounded w-full' />

                    <select name="currency" value={product.currency} onChange={handleChange} className='border p-3 rounded w-full'>
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                    </select>

                    <select name="type" value={product.type} onChange={handleChange} className='border p-3 rounded w-full'>
                        <option value="Stiched">Stiched</option>
                        <option value="Unstiched">Unstiched</option>
                    </select>

                    <input type="text" name="stock" value={product.stock} onChange={handleChange} className='border p-3 rounded w-full' />
                    <input type="text" name="status" value={product.status} onChange={handleChange} className='border p-3 rounded w-full' />
                </div>

                <textarea name="description" value={product.description} onChange={handleChange} className='border p-3 rounded w-full' />

                {/* Fabric Details */}
                <div>
                    <h2 className='text-xl font-semibold mb-2'>Product Details</h2>
                    {fabric_details.map((detail, index) => (
                        <div key={index} className='flex gap-2 mb-2'>
                            <input
                                type="text"
                                value={detail.key}
                                onChange={(e) => handleChangedetails(index, "key", e.target.value)}
                                className='border p-2 rounded flex-1'
                            />
                            <input
                                type="text"
                                value={detail.value}
                                onChange={(e) => handleChangedetails(index, "value", e.target.value)}
                                className='border p-2 rounded flex-1'
                            />
                            <button type="button" onClick={() => removeDetail(index)} className='bg-red-500 text-white px-3 rounded'>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addDetail} className='bg-blue-500 text-white px-4 py-2 rounded'>
                        Add Detail
                    </button>
                </div>

                <button type='submit' className='bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg'>
                    Update Product
                </button>
            </form>
        </div>
    )
}

export default EditPage