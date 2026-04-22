"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, ChevronDown, Search, User } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useUser } from "@/app/context/page";
import CollectionsPreview from "../CollectionsPreview";

const Header = () => {

    const [isOpen, setIsOpen] = useState(false); // mobile sidebar
    const { totalItems } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menOpen, setMenOpen] = useState(false);
    const [womenOpen, setWomenOpen] = useState(false);
    const { logout } = useUser();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md border-b" : "bg-white border-gray-100"
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
                        <li className="relative group">
                            {/* Trigger */}
                            <div className="flex items-center gap-1 cursor-pointer hover:text-black transition duration-300">
                                <span>Collections</span>
                                <ChevronDown
                                    size={16}
                                    className="transition-transform duration-300 group-hover:rotate-180"
                                />
                            </div>

                            {/* Dropdown */}
                            <div className="absolute left-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl 
                  opacity-0 invisible translate-y-3 
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 z-50 p-5 space-y-4">

                                {/* Men's Section */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Men</h4>
                                    <Link
                                        href="/user/collections/unstitched?gender=male"
                                        className="block px-3 py-2 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Unstitched
                                    </Link>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Women's Section */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Women</h4>

                                    <Link
                                        href="/user/collections/unstitched?gender=female"
                                        className="block px-3 py-2 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Unstitched
                                    </Link>

                                    <Link
                                        href="/user/collections/stitched?gender=female"
                                        className="block px-3 py-2 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Stitched
                                    </Link>
                                </div>
                            </div>
                        </li>

                        <li>
                            <Link
                                href="/user/orders"
                                className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#B9974F] after:transition-all after:duration-300 hover:after:w-full"
                            >
                                My Orders
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

                    <Link href="/user/profile" className="text-gray-700 hover:text-black transition">
                        <User size={24} />
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative text-gray-700 hover:text-black transition">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#B9974F] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>

                    {isLoggedIn ? (
                        <button
                            onClick={() => { logout(); setIsLoggedIn(false) }}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Login
                        </Link>

                    )}

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
                        <Link href="/user/profile" className="text-gray-700 hover:text-black transition">
                            <User size={24} />
                        </Link>

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
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg flex flex-col p-6 space-y-3 animate-in slide-in-from-top-5">

                        {/* Basic Links */}
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Home</Link>
                        <Link href="/#about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">About</Link>
                        <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Contact</Link>

                        {/* MEN DROPDOWN */}
                        <div>
                            <div
                                onClick={() => setMenOpen(!menOpen)}
                                className="flex justify-between items-center cursor-pointer text-gray-800 font-semibold text-lg"
                            >
                                <span>Men</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${menOpen ? "rotate-180" : ""}`}
                                />
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${menOpen ? "max-h-40 mt-2" : "max-h-0"}`}>
                                <Link
                                    href="/user/collections/unstitched?gender=male"
                                    onClick={() => setIsOpen(false)}
                                    className="block pl-4 py-2 text-gray-600 hover:text-black"
                                >
                                    Unstitched
                                </Link>
                            </div>
                        </div>

                        {/* WOMEN DROPDOWN */}
                        <div>
                            <div
                                onClick={() => setWomenOpen(!womenOpen)}
                                className="flex justify-between items-center cursor-pointer text-gray-800 font-semibold text-lg"
                            >
                                <span>Women</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${womenOpen ? "rotate-180" : ""}`}
                                />
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${womenOpen ? "max-h-40 mt-2" : "max-h-0"}`}>
                                <Link
                                    href="/user/collections/unstitched?gender=female"
                                    onClick={() => setIsOpen(false)}
                                    className="block pl-4 py-2 text-gray-600 hover:text-black"
                                >
                                    Unstitched
                                </Link>

                                <Link
                                    href="/user/collections/stitched?gender=female"
                                    onClick={() => setIsOpen(false)}
                                    className="block pl-4 py-2 text-gray-600 hover:text-black"
                                >
                                    Stitched
                                </Link>
                            </div>
                        </div>

                        {/* Orders */}
                        <Link href="/user/orders" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">
                            My Orders
                        </Link>

                        <hr className="border-gray-200 my-2" />

                        {/* Auth */}
                        {isLoggedIn ? (
                            <Link
                                href="/"
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                    setIsLoggedIn(false);
                                }}
                                className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium text-center"
                            >
                                Logout
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium text-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;