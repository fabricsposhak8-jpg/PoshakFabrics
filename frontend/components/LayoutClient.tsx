"use client";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useUser } from "../app/context/page";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const isAdmin = user?.role === "admin";

    const pathname = usePathname();
    const hiddenRoutes = ["/login", "/register"];

    // ✅ Wait until localStorage is read before deciding to show/hide
    const shouldHideLayout = isLoaded &&
        (
            hiddenRoutes.includes(pathname) || pathname.startsWith("/Admin")
        );

    return (
        <>
            {!shouldHideLayout && <Header />}
            <main className="flex-1">{children}</main>
            {!shouldHideLayout && <Footer />}
        </>
    );
}