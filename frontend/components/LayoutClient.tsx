"use client";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useUser } from "../app/context/page";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const isAdmin = user?.role === "admin";

    const pathname = usePathname();
    const hiddenlayout = ["/login", "/register"];
    const shouldHideLayout = isAdmin || hiddenlayout.includes(pathname);

    return (
        <>
            {!shouldHideLayout && <Header />}
            <main className="flex-1">{children}</main>
            {!shouldHideLayout && <Footer />}
        </>
    );
}