"use client"

import { useUser } from '@/app/context/page'
import React from 'react'

export default function ProfilePage() {
    const { user } = useUser()

    if (!user) {
        return <div className="p-10 text-gray-500">Loading profile...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

            <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">

                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.username}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                {/* Divider */}
                <hr className="mb-6" />

                {/* Info Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-semibold text-gray-800">{user.username}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>


                </div>

                {/* Button Section */}
                <div className="mt-8 flex justify-end gap-3">
                    <button className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                        Edit Profile
                    </button>

                    <button className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                        Change Password
                    </button>
                </div>

            </div>
        </div>
    )
}