"use client"

import { useUser } from '@/app/context/page'
import React from 'react'
import Link from 'next/link'
import { User, Mail, Shield, LogOut, Edit2, Lock, ArrowRight } from 'lucide-react'

export default function ProfilePage() {
    const { user, isLoaded, logout } = useUser()

    // 1. Loading State
    if (!isLoaded) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#B9974F] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading your profile...</p>
            </div>
        )
    }

    // 2. Unauthenticated State (Login First)
    if (!user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50">
                <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-[#FDF8EE] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-[#B9974F]" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-500 mb-8">Please login to your account to view and manage your profile details.</p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="w-full bg-[#B9974F] text-white font-bold py-4 rounded-xl hover:bg-[#a0833e] transition-all shadow-lg shadow-[#B9974F]/20 flex items-center justify-center gap-2 group"
                        >
                            Login Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/register"
                            className="w-full bg-white text-gray-700 font-semibold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // 3. Authenticated State (Premium Profile)
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 md:p-8">
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] w-full max-w-2xl overflow-hidden border border-gray-100">

                {/* Header Background Decoration */}
                <div className="h-32 bg-gradient-to-r from-[#B9974F] to-[#d4bc8b] relative">
                    <div className="absolute -bottom-12 left-8 md:left-12">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white p-1.5 shadow-xl rotate-3">
                            <div className="w-full h-full rounded-2xl bg-[#B9974F] flex items-center justify-center text-white text-4xl font-black -rotate-3">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-10 px-8 md:px-12">
                    {/* User Title info */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 mb-1">{user.username}</h2>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Shield className="w-4 h-4 text-[#B9974F]" />
                            <span className="text-sm font-semibold uppercase tracking-wider">{user.role || 'Member'}</span>
                        </div>
                    </div>

                    {/* Stats or shortcut row (optional aesthetic touch) */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] uppercase tracking-widest text-[#B9974F] font-bold mb-1">Status</p>
                            <p className="text-gray-900 font-bold">Active Account</p>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] uppercase tracking-widest text-[#B9974F] font-bold mb-1">Joined</p>
                            <p className="text-gray-900 font-bold">Poshak Member</p>
                        </div>
                    </div>

                    {/* Details section */}
                    <div className="space-y-4">
                        <div className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#B9974F]/30 hover:bg-[#FDF8EE]/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#B9974F] group-hover:text-white transition-all">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Full Username</p>
                                <p className="text-gray-900 font-semibold">{user.username}</p>
                            </div>
                        </div>

                        <div className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#B9974F]/30 hover:bg-[#FDF8EE]/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#B9974F] group-hover:text-white transition-all">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Email Address</p>
                                <p className="text-gray-900 font-semibold">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-12 flex flex-wrap gap-4 border-t border-gray-100 pt-8">
                        <button className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-4 bg-[#B9974F] text-white rounded-2xl font-bold hover:bg-[#a0833e] transition-all shadow-lg shadow-[#B9974F]/10">
                            <Edit2 className="w-5 h-5" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}