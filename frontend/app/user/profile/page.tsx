"use client"

import { useUser } from '@/app/context/page'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    User, Mail, Shield, LogOut, Edit2, Phone, MapPin,
    AlertCircle, X, Camera, CheckCircle, Loader2, Sparkles
} from 'lucide-react'

export default function ProfilePage() {
    const { user, isLoaded, logout, updateUser } = useUser()

    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const [form, setForm] = useState({ username: "", email: "", phonenumber: "", address: "" })
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const openModal = () => {
        setForm({
            username: user?.username || "",
            email: user?.email || "",
            phonenumber: user?.phonenumber || "",
            address: user?.address || "",
        })
        setPreviewImage(user?.profilepic || null)
        setSelectedFile(null)
        setSuccessMsg("")
        setErrorMsg("")
        setShowModal(true)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        setPreviewImage(URL.createObjectURL(file))
    }

    const handleSave = async () => {
        setSaving(true)
        setErrorMsg("")
        setSuccessMsg("")
        try {
            const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append("id", String(user?.id))
            formData.append("username", form.username)
            formData.append("email", form.email)
            formData.append("phonenumber", form.phonenumber)
            formData.append("address", form.address)
            if (selectedFile) formData.append("files", selectedFile)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.msg || "Update failed")

            updateUser({
                username: data.user.username,
                email: data.user.email,
                phonenumber: data.user.phonenumber,
                address: data.user.address,
                profilepic: data.user.profilepic?.url || user?.profilepic,
            })

            setSuccessMsg("Profile updated successfully!")
            setTimeout(() => setShowModal(false), 1400)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong"
            setErrorMsg(msg)
        } finally {
            setSaving(false)
        }
    }

    /* ── Loading ── */
    if (!isLoaded) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
            <div className="w-14 h-14 border-4 border-[#B9974F] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-semibold tracking-wide animate-pulse">Loading profile…</p>
        </div>
    )

    /* ── Unauthenticated ── */
    if (!user) return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl border border-red-100 shadow p-10 max-w-sm w-full text-center">
                <AlertCircle className="h-14 w-14 text-red-400 mx-auto mb-4" />
                <p className="text-gray-700 font-semibold mb-6">Please login to view your profile.</p>
                <Link href="/" className="inline-block bg-[#B9974F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#a0833e] transition-colors">
                    Go Home
                </Link>
            </div>
        </div>
    )

    const initials = user.username?.charAt(0).toUpperCase()

    /* ── Authenticated ── */
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#FAF8F4] to-[#F0EBE1] py-10 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* ── Card ── */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_24px_64px_rgba(185,151,79,0.10)] overflow-hidden border border-[#f0e9d8]">

                        {/* ── Hero Banner ── */}
                        <div className="relative h-44 bg-gradient-to-br from-[#B9974F] via-[#c9a85c] to-[#e8d5a3]">
                            {/* Decorative circles */}
                            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10" />
                            <div className="absolute top-4 right-8 opacity-30">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>

                            {/* Avatar — centered on banner */}
                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                                <div className="w-28 h-28 rounded-3xl ring-4 ring-white shadow-2xl overflow-hidden bg-[#B9974F] flex items-center justify-center">
                                    {user.profilepic ? (
                                        <Image
                                            src={user.profilepic}
                                            alt="Profile picture"
                                            width={112}
                                            height={112}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-5xl font-black select-none">{initials}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Body ── */}
                        <div className="pt-20 pb-10 px-8 md:px-12">

                            {/* Name + role */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-gray-900 mb-1">{user.username}</h1>
                                <div className="inline-flex items-center gap-1.5 bg-[#FDF5E6] text-[#B9974F] border border-[#e8d5a3] rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest">
                                    <Shield className="w-3.5 h-3.5" />
                                    {user.role || "Member"}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { label: "Account Status", value: "Active" },
                                    { label: "Member Type", value: user.role === "admin" ? "Administrator" : "Customer" },
                                ].map(s => (
                                    <div key={s.label} className="bg-gradient-to-br from-[#FDF8EE] to-[#FAF3E0] rounded-2xl border border-[#f0e9d8] p-4 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B9974F] mb-1">{s.label}</p>
                                        <p className="text-gray-900 font-black text-sm">{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Detail cards */}
                            <div className="space-y-3">
                                {[
                                    { icon: <User className="w-5 h-5" />, label: "Username", value: user.username },
                                    { icon: <Mail className="w-5 h-5" />, label: "Email Address", value: user.email },
                                    { icon: <Phone className="w-5 h-5" />, label: "Phone Number", value: user.phonenumber || "Not set" },
                                    { icon: <MapPin className="w-5 h-5" />, label: "Address", value: user.address || "Not set" },
                                ].map(({ icon, label, value }) => (
                                    <div
                                        key={label}
                                        className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#B9974F]/40 hover:bg-[#FDF8EE]/60 transition-all duration-200 cursor-default"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-[#B9974F] flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-200 shrink-0">
                                            {icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                                            <p className={`font-semibold truncate text-sm ${value === "Not set" ? "text-gray-300 italic" : "text-gray-900"}`}>{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                                <button
                                    onClick={openModal}
                                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B9974F] text-white rounded-2xl font-bold text-sm hover:bg-[#a0833e] active:scale-[0.98] transition-all shadow-lg shadow-[#B9974F]/20"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-red-50 hover:text-red-500 active:scale-[0.98] transition-all border border-gray-100"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════ EDIT MODAL ══════════════════════ */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <div className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[95dvh] flex flex-col">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-7 pt-7 pb-4 shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Edit Profile</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Update your personal information</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 px-7 pb-8 space-y-5">

                            {/* Avatar upload */}
                            <div className="flex flex-col items-center gap-3 py-2">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#B9974F] flex items-center justify-center shadow-lg ring-4 ring-[#f0e9d8]">
                                        {previewImage ? (
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                                unoptimized={previewImage.startsWith("blob:")}
                                            />
                                        ) : (
                                            <span className="text-white text-4xl font-black select-none">{initials}</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#B9974F] text-white flex items-center justify-center shadow-md hover:bg-[#a0833e] transition-colors border-2 border-white"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Tap the camera icon to change your photo</p>
                            </div>

                            {/* Input fields */}
                            {[
                                { name: "username", label: "Username", placeholder: "Your display name", type: "text", icon: <User className="w-4 h-4" /> },
                                { name: "email", label: "Email Address", placeholder: "your@email.com", type: "email", icon: <Mail className="w-4 h-4" /> },
                                { name: "phonenumber", label: "Phone Number", placeholder: "+92 300 0000000", type: "tel", icon: <Phone className="w-4 h-4" /> },
                            ].map(({ name, label, placeholder, type, icon }) => (
                                <div key={name}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">{icon}</span>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={form[name as keyof typeof form]}
                                            onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B9974F]/30 focus:border-[#B9974F] transition-all"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-300"><MapPin className="w-4 h-4" /></span>
                                    <textarea
                                        rows={3}
                                        placeholder="Your delivery address"
                                        value={form.address}
                                        onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B9974F]/30 focus:border-[#B9974F] transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Feedback banners */}
                            {errorMsg && (
                                <div className="flex items-start gap-3 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm font-medium">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    {errorMsg}
                                </div>
                            )}
                            {successMsg && (
                                <div className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                    {successMsg}
                                </div>
                            )}

                            {/* Save button */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-[#B9974F] text-white rounded-2xl font-bold text-sm hover:bg-[#a0833e] active:scale-[0.98] transition-all shadow-lg shadow-[#B9974F]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
                                    : <><CheckCircle className="w-5 h-5" /> Save Changes</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}