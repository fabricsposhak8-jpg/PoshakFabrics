"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    X, ImagePlus, Tag, Package, Info, Layers,
    Percent, CheckCircle2, ArrowRight, Loader2,
    DollarSign, ListFilter, Scissors, Sparkles
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_BACKEND_URL

/* ─── Reusable labelled input wrapper ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#B9974F]/40 focus:border-[#B9974F] placeholder:text-gray-300 transition-all"

/* ─── Section card ─── */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B9974F] to-[#d4b87a] flex items-center justify-center text-white shadow-sm">
                    {icon}
                </div>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}

export default function AddProductPage() {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [token, setToken] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const [discount, setDiscount] = useState({ discount_perc: "", after_dicou: "" })

    const [product, setProduct] = useState({
        name: "", brand: "", category: "", price: "",
        currency: "PKR", description: "", stock: "",
        status: "active", type: "stitched",
        after_discou: "", discount_perc: ""
    })

    const [fabric_details, setFabricDetails] = useState([{ key: "", value: "" }])

    useEffect(() => {
        const t = localStorage.getItem("token")
        if (t) setToken(t)
    }, [])

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const combined = [...images, ...files].slice(0, 5)
        setImages(combined)
        setPreviews(combined.map(f => URL.createObjectURL(f)))
    }

    const removeImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index)
        setImages(updated)
        setPreviews(updated.map(f => URL.createObjectURL(f)))
    }

    const addDetail = () => setFabricDetails([...fabric_details, { key: "", value: "" }])

    const handleDetailChange = (index: number, field: "key" | "value", val: string) => {
        const updated = [...fabric_details]
        updated[index][field] = val
        setFabricDetails(updated)
    }

    const removeDetail = (index: number) => {
        setFabricDetails(fabric_details.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        Object.entries(product).forEach(([k, v]) => formData.append(k, v))
        formData.append("fabric_details", JSON.stringify(fabric_details))
        images.forEach(img => formData.append("images", img))

        try {

            const res = await fetch(`${API}/api/products/add`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })
            if (res.status === 200) {
                setProduct({ name: "", brand: "", category: "", price: "", currency: "PKR", description: "", stock: "", status: "active", type: "stitched", after_discou: "", discount_perc: "" })
                setFabricDetails([{ key: "", value: "" }])
                setDiscount({ discount_perc: "", after_dicou: "" })
                setImages([]); setPreviews([])
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    router.push("/Admin/products/AllProducts")
                }, 2000)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const modifyDescriptionWithAI = async () => {
        setAiLoading(true)
        try {
            const res = await fetch(`${API}/api/chatbot/modify-description`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: product.description,
                    fabric_details: fabric_details
                })
            })
            if (res.status === 200) {
                const data = await res.json()
                setProduct(p => ({ ...p, description: data.description }))
                setFabricDetails(data.fabric_details)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setAiLoading(false)
        }
    }

    const discountedPrice = discount.after_dicou ? Number(discount.after_dicou) : null

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Fill in the details below to list a new product</p>
                    </div>
                    <Link
                        href="/Admin/products/AllProducts"
                        className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#B9974F] transition-colors shadow-sm"
                    >
                        All Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Success Toast */}
                {success && (
                    <div
                        style={{ animation: "slideInToast 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 text-green-700 px-5 py-4 rounded-2xl shadow-2xl shadow-green-100 min-w-[300px]"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Product Added Successfully!</p>
                            <p className="text-xs text-gray-400 mt-0.5">Redirecting to product list...</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccess(false)}
                            className="ml-auto text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <style>{`
                            @keyframes slideInToast {
                                from { opacity: 0; transform: translateX(110%) scale(0.9); }
                                to   { opacity: 1; transform: translateX(0)   scale(1);   }
                            }
                        `}</style>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Basic Info */}
                    <Section icon={<Tag className="h-4 w-4" />} title="Basic Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Product Name">
                                <input className={inputCls} type="text" name="name" placeholder="e.g. Embroidered Lawn Suit" value={product.name} onChange={handleChange} required />
                            </Field>
                            <Field label="Brand">
                                <input className={inputCls} type="text" name="brand" placeholder="e.g. Poshak" value={product.brand} onChange={handleChange} />
                            </Field>
                            <Field label="Category">
                                <input className={inputCls} type="text" name="category" placeholder="e.g. Summer Collection" value={product.category} onChange={handleChange} />
                            </Field>
                            <Field label="Stock Quantity">
                                <input className={inputCls} type="number" name="stock" placeholder="e.g. 50" value={product.stock} onChange={handleChange} />
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
                                <textarea className={`${inputCls} min-h-[100px] resize-none`} name="description" placeholder="Describe the product..." value={product.description} onChange={handleChange} />
                            </Field>
                        </div>
                    </Section>

                    {/* Pricing */}
                    <Section icon={<DollarSign className="h-4 w-4" />} title="Pricing & Discount">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Price">
                                <input className={inputCls} type="number" name="price" placeholder="e.g. 4500" value={product.price} onChange={handleChange} required />
                            </Field>
                            <Field label="Currency">
                                <select className={inputCls} name="currency" value={product.currency} onChange={handleChange}>
                                    <option value="PKR">PKR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </Field>
                        </div>

                        {/* Discount row */}
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
                    <Section icon={<ImagePlus className="h-4 w-4" />} title="Product Images">
                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-4">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                        <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={11} />
                                        </button>
                                    </div>
                                ))}
                                {/* Empty slots */}
                                {Array.from({ length: 5 - previews.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50" />
                                ))}
                            </div>
                        )}
                        {images.length < 5 && (
                            <label className="cursor-pointer inline-flex items-center gap-2 border-2 border-dashed border-gray-200 px-5 py-3 rounded-xl text-sm text-gray-400 hover:border-[#B9974F] hover:text-[#B9974F] transition-all">
                                <ImagePlus className="h-5 w-5" />
                                Select Images ({images.length}/5)
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                            </label>
                        )}
                        <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB each. First image is shown as the main photo.</p>
                    </Section>

                    {/* Fabric Details */}
                    <Section icon={<Scissors className="h-4 w-4" />} title="Fabric Details">
                        <div className="flex flex-col gap-3">
                            {fabric_details.map((detail, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        className={`${inputCls} flex-1`}
                                        type="text"
                                        placeholder="Key (e.g. Material)"
                                        value={detail.key}
                                        onChange={(e) => handleDetailChange(index, "key", e.target.value)}
                                    />
                                    <input
                                        className={`${inputCls} flex-1`}
                                        type="text"
                                        placeholder="Value (e.g. Cotton)"
                                        value={detail.value}
                                        onChange={(e) => handleDetailChange(index, "value", e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeDetail(index)}
                                        className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors flex-shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDetail}
                                className="self-start text-sm font-semibold text-[#B9974F] hover:text-[#a0833e] flex items-center gap-1.5 transition-colors"
                            >
                                + Add Detail
                            </button>
                        </div>
                    </Section>



                    {/* AI Enhance Button */}
                    <div className="relative">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#B9974F] via-[#e2c47a] to-[#B9974F] rounded-2xl blur opacity-60 ${aiLoading ? "" : "animate-pulse"}`} />
                        <button
                            type="button"
                            onClick={modifyDescriptionWithAI}
                            disabled={aiLoading || loading}
                            className="relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm
                                bg-gradient-to-r from-[#1a1208] via-[#2d1f0a] to-[#1a1208]
                                text-[#e2c47a] border border-[#B9974F]/40
                                hover:from-[#B9974F] hover:via-[#d4b87a] hover:to-[#B9974F]
                                hover:text-white hover:border-transparent
                                hover:shadow-[0_0_30px_rgba(185,151,79,0.5)]
                                disabled:opacity-70 disabled:cursor-not-allowed
                                transition-all duration-500 overflow-hidden group"
                        >
                            {/* Shimmer sweep */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700
                                bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {aiLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                                    <span className="tracking-wide">Enhancing with AI…</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 flex-shrink-0 drop-shadow-[0_0_6px_rgba(226,196,122,0.8)]" />
                                    <span className="tracking-wide">Enhance with AI</span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                                        bg-[#B9974F]/20 text-[#e2c47a] border border-[#B9974F]/30
                                        group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30
                                        transition-all duration-300">
                                        AI
                                    </span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300
                            ${loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-[#B9974F] hover:shadow-lg hover:-translate-y-0.5"}`}
                    >
                        {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding Product…</>
                            : <><Package className="h-4 w-4" /> Add Product</>
                        }
                    </button>

                </form>
            </div>
        </div>
    )
}