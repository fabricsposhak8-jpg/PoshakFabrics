"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false); // mobile sidebar
    const [collectionsHoverDesktop, setCollectionsHoverDesktop] = useState(false); // desktop dropdown
    const { totalItems } = useCart();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md border-b" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:py-4 transition-all duration-300">

                {/* Desktop Logo */}
                <Link href="/" className="hidden md:flex items-center space-x-2">
                    <Image
                        src="/Logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain transition-transform duration-300 hover:scale-110"
                    />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex flex-1 justify-center">
                    <ul className="flex items-center space-x-8 text-gray-700 font-medium">
                        <li>
                            <Link
                                href="/"
                                className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/#about"
                                className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/#contact"
                                className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Desktop Right Icons */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Search Icon */}
                    <button className="text-gray-700 hover:text-black transition">
                        <Search size={24} />
                    </button>

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative text-gray-700 hover:text-black transition">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#B9974F] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Login Button */}
                    <Link href="/login" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        Login
                    </Link>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden w-full flex items-center justify-between px-4 py-3 relative">
                    {/* Left: Hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 focus:outline-none"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Center: Logo */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/">
                            <Image
                                src="/Logo.png"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="object-contain transition-transform duration-300 hover:scale-110"
                            />
                        </Link>
                    </div>

                    {/* Right: Search + Cart */}
                    <div className="flex items-center space-x-4">
                        {/* Search Icon */}
                        <button className="text-gray-700 focus:outline-none">
                            <Search size={24} />
                        </button>

                        {/* Cart Icon */}
                        <Link href="/cart" className="relative text-gray-700">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#B9974F] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg flex flex-col p-6 space-y-2 animate-in slide-in-from-top-5">
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Home</Link>
                        <Link href="/#about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">About</Link>
                        <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Contact</Link>
                        <hr className="border-gray-200 my-2" />
                        <Link href="/login" onClick={() => setIsOpen(false)} className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium">
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;