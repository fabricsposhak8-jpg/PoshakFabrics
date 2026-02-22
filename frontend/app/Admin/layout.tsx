"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "../context/page";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useUser();

    const handleLogout = () => {
        logout();
        router.push("/login");
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
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
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
                    <button onClick={handleLogout} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}