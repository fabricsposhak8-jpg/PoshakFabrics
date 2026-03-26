"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import {
    X, ImagePlus, Tag, Scissors, ArrowLeft,
    CheckCircle2, Loader2, Package, Images, DollarSign, Percent
} from "lucide-react"

/* ─── Reusable helpers ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#B9974F]/40 focus:border-[#B9974F] placeholder:text-gray-300 transition-all"

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B9974F] to-[#d4b87a] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                    {icon}
                </div>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}

const EditPage = () => {
    const { id } = useParams()
    const router = useRouter()

    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [token, setToken] = useState("")

    const [existingImages, setExistingImages] = useState<{ url: string; cloudinary_id: string }[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [newPreviews, setNewPreviews] = useState<string[]>([])

    const [discount, setDiscount] = useState({ discount_perc: "", after_dicou: "" })

    const [product, setProduct] = useState({
        name: "", brand: "", category: "", price: "",
        currency: "PKR", description: "", stock: "",
        status: "active", type: "stitched",
        discount_perc: "", after_discou: "",
    })

    const [fabric_details, setFabricDetails] = useState([{ key: "", value: "" }])

    // Load token
    useEffect(() => {
        const t = localStorage.getItem("token")
        if (t) setToken(t)
    }, [])

    // Fetch product
    useEffect(() => {
        if (!id || !token) return
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/get/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const data = res.data
                const dp = data.discount_perc?.toString() || ""
                const ad = data.after_discou?.toString() || ""
                setProduct({
                    name: data.name || "", brand: data.brand || "",
                    category: data.category || "", price: data.price?.toString() || "",
                    currency: data.currency || "PKR", description: data.description || "",
                    stock: data.stock?.toString() || "", status: data.status || "active",
                    type: data.type || "stitched", discount_perc: dp, after_discou: ad,
                })
                setDiscount({ discount_perc: dp, after_dicou: ad })
                const imgs = typeof data.images === "string" ? JSON.parse(data.images) : data.images
                setExistingImages(imgs || [])
                const fd = typeof data.fabric_details === "string" ? JSON.parse(data.fabric_details) : data.fabric_details
                setFabricDetails(fd?.length > 0 ? fd : [{ key: "", value: "" }])
            } catch (error) {
                console.log("Fetch Error:", error)
            } finally {
                setFetchLoading(false)
            }
        }
        fetchProduct()
    }, [id, token])

    useEffect(() => {
        if (success) window.scrollTo({ top: 0, behavior: "smooth" })
    }, [success])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const price = Number(product.price)
        const perc = Number(value)
        const afterDiscount = price - (price * perc / 100)
        setDiscount({ discount_perc: value, after_dicou: afterDiscount.toFixed(2) })
        setProduct(p => ({ ...p, discount_perc: value, after_discou: afterDiscount.toFixed(2) }))
    }

    const handleChangedetails = (index: number, field: "key" | "value", val: string) => {
        const updated = [...fabric_details]
        updated[index][field] = val
        setFabricDetails(updated)
    }

    const addDetail = () => setFabricDetails([...fabric_details, { key: "", value: "" }])
    const removeDetail = (index: number) => setFabricDetails(fabric_details.filter((_, i) => i !== index))

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const combined = [...newImages, ...files].slice(0, 5)
        setNewImages(combined)
        setNewPreviews(combined.map(f => URL.createObjectURL(f)))
    }

    const removeNewImage = (index: number) => {
        const updated = newImages.filter((_, i) => i !== index)
        setNewImages(updated)
        setNewPreviews(updated.map(f => URL.createObjectURL(f)))
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        Object.entries(product).forEach(([key, value]) => formData.append(key, value))
        formData.append("fabric_details", JSON.stringify(fabric_details))
        newImages.forEach(img => formData.append("images", img))
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/update/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            )
            setSuccess(true)
            setTimeout(() => { setSuccess(false); router.push("/Admin/products/AllProducts") }, 2000)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (fetchLoading) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#B9974F]" />
                <p className="text-sm text-gray-400">Loading product…</p>
            </div>
        </div>
    )

    const discountedPrice = discount.after_dicou ? Number(discount.after_dicou) : null

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Update the details below and save</p>
                    </div>
                </div>

                {/* Success */}
                {success && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        Product updated successfully! Redirecting…
                    </div>
                )}

                <form onSubmit={handleUpdate} className="flex flex-col gap-5">

                    {/* Basic Info */}
                    <Section icon={<Tag className="h-4 w-4" />} title="Basic Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Product Name">
                                <input className={inputCls} type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
                            </Field>
                            <Field label="Brand">
                                <input className={inputCls} type="text" name="brand" placeholder="Brand" value={product.brand} onChange={handleChange} />
                            </Field>
                            <Field label="Category">
                                <input className={inputCls} type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} />
                            </Field>
                            <Field label="Stock Quantity">
                                <input className={inputCls} type="number" name="stock" placeholder="Stock" value={product.stock} onChange={handleChange} />
                            </Field>
                            <Field label="Type">
                                <select className={inputCls} name="type" value={product.type} onChange={handleChange}>
                                    <option value="stitched">Stitched</option>
                                    <option value="unstitched">Unstitched</option>
                                </select>
                            </Field>
                            <Field label="Status">
                                <select className={inputCls} name="status" value={product.status} onChange={handleChange}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </Field>
                        </div>
                        <div className="mt-4">
                            <Field label="Description">
                                <textarea className={`${inputCls} min-h-[100px] resize-none`} name="description" placeholder="Product description…" value={product.description} onChange={handleChange} />
                            </Field>
                        </div>
                    </Section>

                    {/* Pricing & Discount */}
                    <Section icon={<DollarSign className="h-4 w-4" />} title="Pricing & Discount">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Price">
                                <input className={inputCls} type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
                            </Field>
                            <Field label="Currency">
                                <select className={inputCls} name="currency" value={product.currency} onChange={handleChange}>
                                    <option value="PKR">PKR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </Field>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Discount %">
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        className={`${inputCls} pl-10`}
                                        type="number"
                                        placeholder="e.g. 10"
                                        value={discount.discount_perc}
                                        onChange={handleDiscountChange}
                                        min={0} max={100}
                                    />
                                </div>
                            </Field>
                            <Field label="Price After Discount">
                                <div className={`${inputCls} flex items-center gap-2 bg-gray-50 cursor-default`}>
                                    {discountedPrice !== null && discount.discount_perc ? (
                                        <>
                                            <span className="text-gray-400 line-through text-xs">{Number(product.price).toLocaleString()}</span>
                                            <span className="font-bold text-green-600">{discountedPrice.toLocaleString()} {product.currency}</span>
                                            <span className="ml-auto text-[11px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">-{discount.discount_perc}%</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-300 text-sm">Enter discount % to calculate</span>
                                    )}
                                </div>
                            </Field>
                        </div>
                    </Section>

                    {/* Images */}
                    <Section icon={<Images className="h-4 w-4" />} title="Product Images">
                        {existingImages.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Images</p>
                                <div className="flex flex-wrap gap-3">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <img src={img.url} alt={`existing-${i}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                {newImages.length > 0 && (
                                    <p className="text-xs text-amber-600 mt-2 font-medium">
                                        ⚠️ Uploading new images will replace the current ones.
                                    </p>
                                )}
                            </div>
                        )}

                        {newPreviews.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-[#B9974F] uppercase tracking-wider mb-2">New Images</p>
                                <div className="flex flex-wrap gap-3">
                                    {newPreviews.map((src, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                            <img src={src} alt={`new-${i}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={11} />
                                            </button>
                                        </div>
                                    ))}
                                    {Array.from({ length: 5 - newPreviews.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-100 bg-gray-50" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {newImages.length < 5 && (
                            <label className="cursor-pointer inline-flex items-center gap-2 border-2 border-dashed border-gray-200 px-5 py-3 rounded-xl text-sm text-gray-400 hover:border-[#B9974F] hover:text-[#B9974F] transition-all">
                                <ImagePlus className="h-5 w-5" />
                                Upload New Images ({newImages.length}/5)
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                            </label>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Leave empty to keep current images.</p>
                    </Section>

                    {/* Fabric Details */}
                    <Section icon={<Scissors className="h-4 w-4" />} title="Fabric Details">
                        <div className="flex flex-col gap-3">
                            {fabric_details.map((detail, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input className={`${inputCls} flex-1`} type="text" placeholder="Key (e.g. Material)" value={detail.key} onChange={(e) => handleChangedetails(index, "key", e.target.value)} />
                                    <input className={`${inputCls} flex-1`} type="text" placeholder="Value (e.g. Cotton)" value={detail.value} onChange={(e) => handleChangedetails(index, "value", e.target.value)} />
                                    <button type="button" onClick={() => removeDetail(index)}
                                        className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors flex-shrink-0">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addDetail} className="self-start text-sm font-semibold text-[#B9974F] hover:text-[#a0833e] transition-colors">
                                + Add Detail
                            </button>
                        </div>
                    </Section>

                    {/* Submit */}
                    <button type="submit" disabled={loading}
                        className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300
                            ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-[#B9974F] hover:shadow-lg hover:-translate-y-0.5"}`}>
                        {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</>
                            : <><Package className="h-4 w-4" /> Update Product</>
                        }
                    </button>

                </form>
            </div>
        </div>
    )
}

export default EditPage