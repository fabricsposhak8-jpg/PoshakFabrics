// app/layout.tsx
"use client"

import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import UserProvider from "./context/page";
import { useUser } from "./context/page";
import { usePathname } from "next/navigation";


function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const pathname = usePathname();
  const hiddenlayout = ["/login", "/register"]
  const shouldHideLayout = isAdmin || hiddenlayout.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main className="flex-1">{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <UserProvider>
          <LayoutContent>{children}</LayoutContent>
        </UserProvider>
      </body>
    </html>
  );
}
