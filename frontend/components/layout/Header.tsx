"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false); // mobile sidebar
    const [collectionsOpenMobile, setCollectionsOpenMobile] = useState(false); // mobile dropdown
    const [collectionsHoverDesktop, setCollectionsHoverDesktop] = useState(false); // desktop dropdown
    const { totalItems } = useCart();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {

            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, []);


    return (
        <header className={`w-full border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md border-b" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:py-4 transition-all duration-300">

                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/Logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="object-contain transition-transform duration-300 hover:scale-110"
                    />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex">
                    <ul className="flex items-center space-x-8 text-gray-700 font-medium">
                        <li><Link href="/" className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">Home</Link></li>
                        <li
                            className="relative"
                            onClick={() => setCollectionsHoverDesktop(!collectionsHoverDesktop)}
                            onMouseEnter={() => setCollectionsHoverDesktop(true)}
                            onMouseLeave={() => setCollectionsHoverDesktop(false)}
                        >
                            <button className="flex items-center space-x-1 cursor-pointer hover:text-black transition font-medium">
                                <span className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">Collections</span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${collectionsHoverDesktop ? "rotate-180" : "rotate-0"}`}
                                />
                            </button>
                            <div
                                className={`absolute left-0 top-full w-48 bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden transition-all duration-300 ${collectionsHoverDesktop
                                    ? "max-h-40 opacity-100 visible mt-2"
                                    : "max-h-0 opacity-0 invisible"
                                    }`}
                            >
                                <Link href="/user/collections/stitched" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Stitched</Link>
                                <Link href="/user/collections/unstitched" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Unstitched</Link>
                            </div>
                        </li>

                        <li><Link href="/#about" className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">About</Link></li>
                        <li><Link href="/#contact" className="hover:text-black transition duration-200 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">Contact</Link></li>
                    </ul>
                </nav>

                {/* Right Icons */}
                <div className="flex items-center space-x-4">
                    <Link href={"/cart"}
                        className="relative text-gray-700 hover:text-black transition">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#B9974F] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>

                    <a href="/login" className="hidden md:block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        Login
                    </a>

                    <button
                        className="md:hidden text-gray-700 hover:text-black focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {
                isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg flex flex-col p-6 space-y-2 animate-in slide-in-from-top-5">
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Home</Link>
                        {/* <Link href="/shop" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Shop</Link> */}

                        {/* Mobile Collections Dropdown */}
                        <div className="flex flex-col">
                            <button
                                onClick={() => setCollectionsOpenMobile(!collectionsOpenMobile)}
                                className="flex justify-between items-center text-gray-700 hover:text-black font-medium text-lg w-full"
                            >
                                Collections
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform duration-300 ${collectionsOpenMobile ? "rotate-180" : "rotate-0"}`}
                                />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${collectionsOpenMobile ? "max-h-40 mt-2" : "max-h-0"}`}>
                                <Link href="/user/collections/stitched" onClick={() => { setIsOpen(false); setCollectionsOpenMobile(false); }} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Stitched
                                </Link>
                                <Link href="/user/collections/unstitched" onClick={() => { setIsOpen(false); setCollectionsOpenMobile(false); }} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Unstitched
                                </Link>
                            </div>
                        </div>

                        <Link href="/#about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">About</Link>
                        <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black font-medium text-lg">Contact</Link>

                        <hr className="border-gray-200 my-2" />

                        <Link href="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium">
                            Login
                        </Link>
                    </div>
                )
            }
        </header >
    );
};

export default Header;