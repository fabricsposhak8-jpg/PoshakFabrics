"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
    ShoppingBag, CreditCard, Wallet, Truck, CheckCircle2,
    ArrowLeft, MapPin, Tag, Package, AlertCircle, Loader2,
    Upload, Copy, CheckCheck, Phone
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
const SHIPPING = 250;

const PAYMENT_METHODS = [
    {
        id: "easypaisa",
        label: "Easypaisa",
        icon: <Wallet className="h-5 w-5" />,
        desc: "Pay via Easypaisa mobile wallet",
        color: "from-green-500 to-green-600",
        number: "0342-1852394",
    },
    {
        id: "jazzcash",
        label: "JazzCash",
        icon: <CreditCard className="h-5 w-5" />,
        desc: "Pay via JazzCash mobile wallet",
        color: "from-red-500 to-orange-500",
        number: "0342-1852394",
    },
];

export default function CheckoutPage() {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("easypaisa");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const selectedPM = PAYMENT_METHODS.find(p => p.id === paymentMethod)!;

    /* ── Fetch product ── */
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${API}/api/products/user/${id}`);
                const data = res.data;
                if (typeof data.images === "string") {
                    try { data.images = JSON.parse(data.images); } catch { data.images = []; }
                }
                setProduct(data);
            } catch {
                setError("Failed to load product.");
            } finally {
                setFetchLoading(false);
            }
        };
        if (id) fetch();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedPM.number.replace(/-/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setScreenshotFile(file);
        setScreenshotPreview(URL.createObjectURL(file));
    };

    /* ── Place order ── */
    const handleOrder = async () => {
        const token = localStorage.getItem("token");
        if (!token) { setError("Please log in to place an order."); return; }
        setLoading(true);
        setError("");
        try {
            const totalPrice = product.price + SHIPPING;

            // Must use FormData — multer on the backend parses multipart/form-data,
            // NOT plain JSON, so req.body fields are only available with FormData.
            const formData = new FormData();
            formData.append("payment_method", paymentMethod);
            formData.append("total_price", String(totalPrice + SHIPPING));
            if (screenshotFile) {
                formData.append("payment_receipt", screenshotFile);
            }

            await axios.post(
                `${API}/api/order/add/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.msg || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ── Loading ── */
    if (fetchLoading) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-[#B9974F]" />
                <p className="text-gray-500 text-sm">Loading checkout…</p>
            </div>
        </div>
    );

    /* ── Success ── */
    if (success) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 max-w-md w-full text-center">
                <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl" />
                    <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-5">
                        <CheckCircle2 className="h-14 w-14 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
                <p className="text-gray-500 text-sm mb-1">
                    Your order for <span className="font-semibold text-gray-800">{product?.name}</span> has been placed.
                </p>
                <p className="text-gray-400 text-xs mb-8">We'll contact you shortly to confirm delivery details.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/user/orders" className="flex-1 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#B9974F] transition-colors text-center">
                        My Orders
                    </Link>
                    <Link href="/user/collections" className="flex-1 bg-[#B9974F] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#a0833e] transition-colors text-center">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );

    const totalPrice = product ? product.price + SHIPPING : 0;

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Complete Your Order</h1>
                        <p className="text-sm text-gray-400">Follow the steps below to place your order</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── LEFT ── */}
                    <div className="lg:col-span-3 flex flex-col gap-5">

                        {/* STEP 1 — Payment Method */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                                <h2 className="text-base font-bold text-gray-800">Select Payment Method</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PAYMENT_METHODS.map((pm) => (
                                        <button
                                            key={pm.id}
                                            onClick={() => setPaymentMethod(pm.id)}
                                            className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === pm.id
                                                ? "border-[#B9974F] bg-[#B9974F]/5 shadow-sm"
                                                : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pm.color} flex items-center justify-center text-white flex-shrink-0`}>
                                                {pm.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-bold ${paymentMethod === pm.id ? "text-[#B9974F]" : "text-gray-800"}`}>{pm.label}</p>
                                                <p className="text-xs text-gray-400">{pm.desc}</p>
                                            </div>
                                            {paymentMethod === pm.id && (
                                                <CheckCircle2 className="h-5 w-5 text-[#B9974F] flex-shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* STEP 2 — Account Number */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                                <h2 className="text-base font-bold text-gray-800">Send Payment To</h2>
                            </div>
                            <div className="p-6">
                                <div className={`bg-gradient-to-br ${selectedPM.color} rounded-2xl p-5 text-white`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-white/20 rounded-lg p-1.5">
                                                {selectedPM.icon}
                                            </div>
                                            <span className="font-bold text-lg">{selectedPM.label}</span>
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                    <div className="bg-white/15 rounded-xl p-3 flex items-center gap-2">
                                        <Phone className="h-4 w-4 opacity-80" />
                                        <span className="text-xl font-bold tracking-widest">{selectedPM.number}</span>
                                    </div>
                                    <p className="text-white/70 text-xs mt-2">Account Name: Poshak Fabrics</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Transfer the exact total amount to the number above, then upload your payment screenshot below.
                                </p>
                            </div>
                        </div>

                        {/* STEP 3 — Screenshot Upload */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">3</span>
                                <h2 className="text-base font-bold text-gray-800">Upload Payment Screenshot</h2>
                            </div>
                            <div className="p-6">
                                {screenshotPreview ? (
                                    <div className="relative group">
                                        <img
                                            src={screenshotPreview}
                                            alt="Payment screenshot"
                                            className="w-full max-h-56 object-contain rounded-xl border border-gray-200 bg-gray-50"
                                        />
                                        <button
                                            onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Remove
                                        </button>
                                        <div className="flex items-center gap-2 mt-3 text-green-600 text-sm font-medium">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Screenshot uploaded: {screenshotFile?.name}
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#B9974F] hover:bg-[#B9974F]/5 transition-all group">
                                        <Upload className="h-8 w-8 text-gray-300 group-hover:text-[#B9974F] mb-2 transition-colors" />
                                        <p className="text-sm font-medium text-gray-500 group-hover:text-[#B9974F] transition-colors">Click to upload screenshot</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                        <input type="file" accept="image/*" name="payment_receipt" className="hidden" onChange={handleScreenshot} />
                                    </label>
                                )}
                                <div className="mt-3 flex items-center justify-center">
                                    <Link
                                        href="/#contact"
                                        className="text-sm text-[#B9974F] hover:underline font-medium"
                                    >
                                        Need help? Contact us →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* STEP 4 — Delivery Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">4</span>
                                <h2 className="text-base font-bold text-gray-800">Delivery Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-3 text-sm text-gray-600 bg-[#B9974F]/5 rounded-xl p-4 border border-[#B9974F]/20 mb-4">
                                    <MapPin className="h-4 w-4 text-[#B9974F] flex-shrink-0 mt-0.5" />
                                    <p>We deliver across Pakistan. Our team will call you to confirm your address after the order is placed.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { step: "Order Placed", num: 1, active: true },
                                        { step: "Confirmed", num: 2, active: false },
                                        { step: "Delivered", num: 3, active: false },
                                    ].map(({ step, num, active }) => (
                                        <div key={step} className="flex flex-col items-center gap-2">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 ${active ? "bg-[#B9974F] border-[#B9974F] text-white" : "bg-white border-gray-200 text-gray-400"
                                                }`}>
                                                {num}
                                            </div>
                                            <span className="text-[11px] text-gray-500 text-center">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Order Summary ── */}
                    <div className="lg:col-span-2 flex flex-col gap-5 lg:sticky lg:top-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-[#B9974F]" />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="p-6">
                                {/* Product */}
                                {product && (
                                    <div className="flex gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        {product.images?.[0]?.url ? (
                                            <img
                                                src={product.images[0].url}
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Package className="h-8 w-8 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 leading-snug">{product.name}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Tag className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-400">{product.brand}</span>
                                            </div>
                                            <p className="text-sm font-bold text-[#B9974F] mt-1.5">
                                                {Number(product.price).toLocaleString()} {product.currency}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Price breakdown */}
                                <div className="flex flex-col gap-2.5 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-700">{Number(product?.price).toLocaleString()} {product?.currency}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Shipping</span>
                                        <span className="font-medium text-gray-700">{SHIPPING.toLocaleString()} {product?.currency}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 my-1" />
                                    <div className="flex justify-between font-bold text-base">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-[#B9974F]">{totalPrice.toLocaleString()} {product?.currency}</span>
                                    </div>
                                </div>

                                {/* Place Order */}
                                <button
                                    onClick={handleOrder}
                                    disabled={loading || !product}
                                    className={`w-full mt-5 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md transition-all duration-300
                                        ${loading
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-900 text-white hover:bg-[#B9974F] hover:shadow-lg hover:-translate-y-0.5"
                                        }`}
                                >
                                    {loading
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order…</>
                                        : <><ShoppingBag className="h-4 w-4" /> Place Order</>
                                    }
                                </button>

                                <p className="text-center text-[11px] text-gray-400 mt-3 leading-relaxed">
                                    By placing your order, you agree to our terms and conditions.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
