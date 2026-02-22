"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";

const Header = () => {
    // State to toggle mobile menu
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full border-b bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/Logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </Link>

                {/* Desktop Navigation (Hidden on Mobile) */}
                <nav className="hidden md:flex">
                    <ul className="flex items-center space-x-8 text-gray-700 font-medium">
                        <li><Link href="/" className="hover:text-black transition">Home</Link></li>
                        <li><Link href="/shop" className="hover:text-black transition">Shop</Link></li>
                        <li className="relative group">
                            <Link href="/user/collections" className="hover:text-black transition">Collections</Link>
                            <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">
                                <Link href="/user/collections/stitched" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Stitched</Link>
                                <Link href="/user/collections/unstitched" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Unstitched</Link>
                            </div>
                        </li>

                        <li><Link href="#about" className="hover:text-black transition">About</Link></li>
                        <li><Link href="#contact" className="hover:text-black transition">Contact</Link></li>
                    </ul>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">

                    {/* Cart Icon (Visible on all screens) */}
                    <button className="text-gray-700 hover:text-black transition">
                        <ShoppingCart size={24} />
                    </button>

                    {/* Desktop Login Button (Hidden on Mobile) */}
                    <a href="/login" className="hidden md:block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        Login
                    </a>

                    {/* Mobile Menu Toggle (Visible only on Mobile) */}
                    <button
                        className="md:hidden text-gray-700 hover:text-black focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg flex flex-col p-6 space-y-4 animate-in slide-in-from-top-5">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Home</Link>
                    <Link href="/shop" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Shop</Link>
                    <Link href="/user/collections" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Collections</Link>
                    <Link href="#about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">About</Link>
                    <Link href="#contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Contact</Link>

                    <hr className="border-gray-200" />

                    <button className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium">
                        Login
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;