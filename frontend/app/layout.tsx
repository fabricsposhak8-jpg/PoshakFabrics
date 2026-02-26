// app/layout.tsx (SERVER COMPONENT)

import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "./context/page";
import CartProvider from "./context/CartContext";
import LayoutClient from "../components/LayoutClient";

export const metadata: Metadata = {
  title: "Poshak Fabrics",
  description: "Premium Clothing Store",
  icons: {
    icon: "/Logo.ico",
  },
  openGraph: {
    title: "Poshak Fabrics",
    description: "Premium Clothing Store",
    url: "https://www.poshakfabrics.org",
    siteName: "Poshak Fabrics",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Poshak Fabrics - Premium Clothing Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <UserProvider>
            <LayoutClient>{children}</LayoutClient>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}