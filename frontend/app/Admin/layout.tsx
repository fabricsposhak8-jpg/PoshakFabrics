"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "../context/page";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useUser();

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const navLinks = [
        { href: "/Admin", label: "Dashboard" },
        { href: "/Admin/products", label: "Products" },
        { href: "/Admin/orders", label: "Orders" },
        { href: "/Admin/customers", label: "Customers" },
        { href: "/Admin/messages", label: "Messages" },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col
                transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static lg:flex
            `}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>

                    {/* Close button (mobile) */}
                    <button
                        className="lg:hidden text-gray-600"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-2 rounded-lg transition ${pathname === link.href
                                ? "bg-yellow-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full">
                {/* Top Bar (Mobile) */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-gray-700 text-xl"
                    >
                        ☰
                    </button>
                    <h1 className="font-semibold">Admin Panel</h1>
                </div>

                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}