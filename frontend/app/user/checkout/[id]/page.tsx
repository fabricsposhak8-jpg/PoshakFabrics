"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ShoppingBag, CreditCard, Wallet, Truck, CheckCircle2,
    ArrowLeft, MapPin, Tag, Package, AlertCircle, Loader2,
    Upload, Copy, CheckCheck, Phone, User, Building2, Hash, Home,
    ChevronRight, XCircle, RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
const SHIPPING = 250;

interface AddressForm {
    city: string;
    country: string;
    postal_code: string;
    address_line: string;
    quantity: number;
}

const PAYMENT_METHODS = [
    {
        id: "easypaisa",
        label: "Easypaisa",
        icon: <Wallet className="h-5 w-5" />,
        desc: "Pay via Easypaisa mobile wallet",
        color: "from-green-500 to-emerald-600",
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
        number: "0342-6659927",
    },
    {
        id: "jazzcash",
        label: "JazzCash",
        icon: <CreditCard className="h-5 w-5" />,
        desc: "Pay via JazzCash mobile wallet",
        color: "from-red-500 to-orange-500",
        bg: "from-red-50 to-orange-50",
        border: "border-red-200",
        number: "0345-0117043",
    },
];

/* ─── Step Header ─── */
function StepHeader({ num, title }: { num: number; title: string }) {
    return (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/60">
            <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                {num}
            </span>
            <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">{title}</h2>
        </div>
    );
}

/* ─── Input Field ─── */
function Field({
    label, icon, value, onChange, type = "text", placeholder, min,
}: {
    label: string;
    icon: React.ReactNode;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    min?: number;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                <input
                    type={type}
                    value={value}
                    min={min}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white
                               focus:outline-none focus:ring-2 focus:ring-[#B9974F]/40 focus:border-[#B9974F]
                               placeholder:text-gray-300 transition-all"
                />
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("easypaisa");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [orderFailed, setOrderFailed] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const [address, setAddress] = useState<AddressForm>({
        city: "",
        country: "Pakistan",
        postal_code: "",
        address_line: "",
        quantity: 1,
    });

    const selectedPM = PAYMENT_METHODS.find((p) => p.id === paymentMethod)!;

    /* ── Fetch product ── */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/api/products/user/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data = await res.json();
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
        if (id) fetchProduct();
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

        // Validate address
        if (!address.address_line.trim() || !address.city.trim() || !address.country.trim()) {
            setError("Please fill in all required address fields.");
            return;
        }
        if (address.quantity < 1) {
            setError("Quantity must be at least 1.");
            return;
        }

        setLoading(true);
        setError("");
        setOrderFailed(false);

        try {
            const unitPrice = Number(product.price);
            const totalPrice = unitPrice * address.quantity + SHIPPING;

            const formData = new FormData();
            formData.append("payment_method", paymentMethod);
            formData.append("total_price", String(totalPrice));
            formData.append("quantity", String(address.quantity));
            formData.append("country", address.country);
            formData.append("city", address.city);
            formData.append("postal_code", address.postal_code);
            formData.append("address_line", address.address_line);
            if (screenshotFile) {
                formData.append("payment_receipt", screenshotFile);
            }

            const res = await fetch(`${API}/api/order/add/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })
            const data = await res.json();
            if (data.success) {
                console.log("Order created successfully");
                setSuccess(true);
            } else {
                console.log("Order failed");
                setError(data.msg);
                setOrderFailed(true);
            }
        } catch (err: any) {
            const msg = err?.response?.data?.msg || "Something went wrong. Please try again.";
            setError(msg);
            setOrderFailed(true);
        } finally {
            setLoading(false);
        }
    };

    /* ── Loading ── */
    if (fetchLoading) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#B9974F]/20 rounded-full blur-lg" />
                    <Loader2 className="relative h-10 w-10 animate-spin text-[#B9974F]" />
                </div>
                <p className="text-gray-400 text-sm font-medium">Loading checkout…</p>
            </div>
        </div>
    );

    /* ── Success ── */
    if (success) return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] to-[#F0EDE6] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 max-w-md w-full text-center">
                <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl scale-150" />
                    <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-5 shadow-lg">
                        <CheckCircle2 className="h-14 w-14 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
                <p className="text-gray-500 text-sm mb-1">
                    Your order for{" "}
                    <span className="font-semibold text-gray-800">{product?.name}</span>{" "}
                    has been placed successfully.
                </p>
                <p className="text-gray-400 text-xs mb-8">
                    We'll contact you shortly to confirm delivery details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/user/orders"
                        className="flex-1 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#B9974F] transition-colors text-center"
                    >
                        My Orders
                    </Link>
                    <Link
                        href="/#collections"
                        className="flex-1 border-2 border-[#B9974F] text-[#B9974F] px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#B9974F] hover:text-white transition-all text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );

    /* ── Order Failed ── */
    if (orderFailed) return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] to-[#F5EDED] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 max-w-md w-full text-center">
                <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl scale-150" />
                    <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-5 shadow-lg">
                        <XCircle className="h-14 w-14 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Placed 😞</h1>
                <p className="text-gray-500 text-sm mb-1">
                    We couldn't place your order for{" "}
                    <span className="font-semibold text-gray-800">{product?.name}</span>.
                </p>
                <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mt-3 mb-6 leading-relaxed">
                    {error || "Something went wrong. Please try again."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => { setOrderFailed(false); setError(""); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#B9974F] transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                    <Link
                        href="/user/collections"
                        className="flex-1 border-2 border-gray-200 text-gray-600 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all text-center"
                    >
                        Back to Shop
                    </Link>
                </div>
                <div className="mt-5">
                    <Link href="/#contact" className="text-xs text-[#B9974F] hover:underline font-medium">
                        Need help? Contact support →
                    </Link>
                </div>
            </div>
        </div>
    );

    const unitPrice = product ? Number(product.price) : 0;
    const subtotal = unitPrice * address.quantity;
    const totalPrice = subtotal + SHIPPING;

    return (
        <div className="min-h-screen bg-[#FAF9F7] py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* ── Header ── */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Complete Your Order</h1>
                        <p className="text-sm text-gray-400">Fill in all steps below to place your order</p>
                    </div>
                </div>

                {/* ── Progress Bar ── */}
                <div className="mb-6 flex items-center gap-2 text-xs text-gray-400">
                    {["Address", "Payment Method", "Send Payment", "Upload Receipt"].map((s, i) => (
                        <React.Fragment key={s}>
                            <span className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#B9974F] text-white text-[10px] font-bold flex items-center justify-center">
                                    {i + 1}
                                </span>
                                <span className="hidden sm:inline font-medium text-gray-600">{s}</span>
                            </span>
                            {i < 3 && <ChevronRight className="h-3 w-3 text-gray-300 flex-shrink-0" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ────────────── LEFT ────────────── */}
                    <div className="lg:col-span-3 flex flex-col gap-5">

                        {/* STEP 1 — Address Details */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <StepHeader num={1} title="Delivery Address" />
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Full Address"
                                        icon={<Home className="h-4 w-4" />}
                                        value={address.address_line}
                                        onChange={(v) => setAddress({ ...address, address_line: v })}
                                        placeholder="Street, Block, House No."
                                    />
                                </div>
                                <Field
                                    label="City"
                                    icon={<Building2 className="h-4 w-4" />}
                                    value={address.city}
                                    onChange={(v) => setAddress({ ...address, city: v })}
                                    placeholder="e.g. Lahore"
                                />
                                <Field
                                    label="Country"
                                    icon={<MapPin className="h-4 w-4" />}
                                    value={address.country}
                                    onChange={(v) => setAddress({ ...address, country: v })}
                                    placeholder="e.g. Pakistan"
                                />
                                <Field
                                    label="Postal Code"
                                    icon={<Hash className="h-4 w-4" />}
                                    value={address.postal_code}
                                    onChange={(v) => setAddress({ ...address, postal_code: v })}
                                    placeholder="e.g. 54000"
                                />
                                <Field
                                    label="Quantity"
                                    icon={<Package className="h-4 w-4" />}
                                    value={address.quantity}
                                    type="number"
                                    min={1}
                                    onChange={(v) => setAddress({ ...address, quantity: Math.max(1, Number(v)) })}
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        {/* STEP 2 — Payment Method */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <StepHeader num={2} title="Select Payment Method" />
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PAYMENT_METHODS.map((pm) => {
                                        const active = paymentMethod === pm.id;
                                        return (
                                            <button
                                                key={pm.id}
                                                onClick={() => setPaymentMethod(pm.id)}
                                                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                                                    ${active
                                                        ? `border-[#B9974F] bg-gradient-to-br ${pm.bg} shadow-md`
                                                        : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                                                    }`}
                                            >
                                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pm.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                                                    {pm.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-bold ${active ? "text-[#B9974F]" : "text-gray-800"}`}>
                                                        {pm.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{pm.desc}</p>
                                                </div>
                                                {active && (
                                                    <CheckCircle2 className="h-5 w-5 text-[#B9974F] flex-shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* STEP 3 — Account Number */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <StepHeader num={3} title="Send Payment To" />
                            <div className="p-6">
                                <div className={`bg-gradient-to-br ${selectedPM.color} rounded-2xl p-5 text-white shadow-lg`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                                                {selectedPM.icon}
                                            </div>
                                            <span className="font-bold text-lg tracking-wide">{selectedPM.label}</span>
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors backdrop-blur-sm"
                                        >
                                            {copied
                                                ? <><CheckCheck className="h-3.5 w-3.5" /> Copied!</>
                                                : <><Copy className="h-3.5 w-3.5" /> Copy</>
                                            }
                                        </button>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3.5 flex items-center gap-3">
                                        <Phone className="h-4 w-4 opacity-80 flex-shrink-0" />
                                        <span className="text-2xl font-bold tracking-widest">{selectedPM.number}</span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-white/75 text-xs">
                                        <User className="h-3.5 w-3.5" />
                                        <span>Account Name: Abdul Rafi</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
                                    Transfer the exact total of{" "}
                                    <span className="font-bold text-gray-700">{totalPrice.toLocaleString()} {product?.currency}</span>{" "}
                                    to the number above, then upload the screenshot below.
                                </p>
                            </div>
                        </div>

                        {/* STEP 4 — Screenshot Upload */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <StepHeader num={4} title="Upload Payment Screenshot" />
                            <div className="p-6">
                                {screenshotPreview ? (
                                    <div className="relative group">
                                        <img
                                            src={screenshotPreview}
                                            alt="Payment screenshot"
                                            className="w-full max-h-60 object-contain rounded-xl border border-gray-200 bg-gray-50"
                                        />
                                        <button
                                            onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            Remove
                                        </button>
                                        <div className="flex items-center gap-2 mt-3 text-green-600 text-sm font-medium">
                                            <CheckCircle2 className="h-4 w-4" />
                                            {screenshotFile?.name}
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#B9974F] hover:bg-[#B9974F]/5 transition-all group">
                                        <div className="bg-gray-100 group-hover:bg-[#B9974F]/10 rounded-full p-3 mb-2 transition-colors">
                                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#B9974F] transition-colors" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-500 group-hover:text-[#B9974F] transition-colors">
                                            Click to upload screenshot
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10 MB</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="payment_receipt"
                                            className="hidden"
                                            onChange={handleScreenshot}
                                        />
                                    </label>
                                )}
                                <div className="mt-4 flex items-center justify-center">
                                    <Link href="/#contact" className="text-xs text-[#B9974F] hover:underline font-medium">
                                        Need help? Contact us →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Steps */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/60">
                                <Truck className="h-4 w-4 text-[#B9974F]" />
                                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Delivery Timeline</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-3 text-sm text-gray-500 bg-[#B9974F]/5 rounded-xl p-4 border border-[#B9974F]/15 mb-5">
                                    <MapPin className="h-4 w-4 text-[#B9974F] flex-shrink-0 mt-0.5" />
                                    <p>We deliver across Pakistan. Our team will call you to confirm your delivery details.</p>
                                </div>
                                <div className="relative flex items-center justify-between">
                                    <div className="absolute left-0 right-0 h-0.5 bg-gray-100 top-4 mx-10" />
                                    {[
                                        { step: "Order Placed", num: 1, active: true, icon: <ShoppingBag className="h-3.5 w-3.5" /> },
                                        { step: "Confirmed", num: 2, active: false, icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                                        { step: "Delivered", num: 3, active: false, icon: <Truck className="h-3.5 w-3.5" /> },
                                    ].map(({ step, active, icon }) => (
                                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                                                ${active
                                                    ? "bg-[#B9974F] border-[#B9974F] text-white shadow-md shadow-[#B9974F]/30"
                                                    : "bg-white border-gray-200 text-gray-300"
                                                }`}>
                                                {icon}
                                            </div>
                                            <span className={`text-[11px] text-center font-medium ${active ? "text-[#B9974F]" : "text-gray-400"}`}>
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && !orderFailed && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-4 rounded-xl shadow-sm">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
                                <div className="flex-1">
                                    <p className="font-semibold text-red-700 mb-0.5">Unable to place order</p>
                                    <p className="text-red-500 text-xs leading-relaxed">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ────────────── RIGHT: Order Summary ────────────── */}
                    <div className="lg:col-span-2 flex flex-col gap-5 lg:sticky lg:top-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
                                <ShoppingBag className="h-5 w-5 text-[#B9974F]" />
                                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Order Summary</h2>
                            </div>
                            <div className="p-6">

                                {/* Product card */}
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
                                            <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
                                            {product.brand && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Tag className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-400">{product.brand}</span>
                                                </div>
                                            )}
                                            <p className="text-sm font-bold text-[#B9974F] mt-1.5">
                                                {unitPrice.toLocaleString()} {product.currency}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Price breakdown */}
                                <div className="flex flex-col gap-2.5 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>
                                            Price × {address.quantity}
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            {subtotal.toLocaleString()} {product?.currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <Truck className="h-3.5 w-3.5" />
                                            Shipping
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            {SHIPPING.toLocaleString()} {product?.currency}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />
                                    <div className="flex justify-between font-bold text-base">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-[#B9974F] text-lg">
                                            {totalPrice.toLocaleString()} {product?.currency}
                                        </span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handleOrder}
                                    disabled={loading || !product}
                                    className={`w-full mt-5 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md transition-all duration-300
                                        ${loading || !product
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-900 text-white hover:bg-[#B9974F] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                        }`}
                                >
                                    {loading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order…</>
                                    ) : (
                                        <><ShoppingBag className="h-4 w-4" /> Place Order</>
                                    )}
                                </button>

                                <p className="text-center text-[11px] text-gray-400 mt-3 leading-relaxed">
                                    By placing your order, you agree to our{" "}
                                    <span className="underline cursor-pointer hover:text-[#B9974F] transition-colors">
                                        terms & conditions
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {[
                                    { icon: <Truck className="h-5 w-5" />, label: "Nationwide Delivery" },
                                    { icon: <CheckCircle2 className="h-5 w-5" />, label: "Verified Products" },
                                    { icon: <Phone className="h-5 w-5" />, label: "24/7 Support" },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-1.5 text-gray-500">
                                        <div className="text-[#B9974F]">{icon}</div>
                                        <span className="text-[10px] font-medium leading-tight">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
