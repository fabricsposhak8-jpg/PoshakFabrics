// app/layout.tsx (SERVER COMPONENT)

import type { Metadata } from "next";
import "./globals.css";
import UserProvider from "./context/page";
import CartProvider from "./context/CartContext";
import LayoutClient from "../components/LayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://poshakfabrics.org"),
  title: "Poshak Fabrics | Premium Clothing Store in Pakistan",
  description:
    "Buy premium fabrics, unstitched suits and clothing online from Poshak Fabrics. Shop the finest ethnic wear, stitched and unstitched collections delivered across Pakistan.",
  keywords: [
    "Poshak Fabrics",
    "premium fabrics Pakistan",
    "unstitched suits",
    "stitched clothing",
    "ethnic wear Pakistan",
    "online fabric store",
    "buy fabrics online",
    "Pakistani clothing",
  ],
  icons: {
    icon: "/Logo.ico",
  },
  openGraph: {
    title: "Poshak Fabrics | Premium Clothing Store in Pakistan",
    description:
      "Buy premium fabrics, unstitched suits and clothing online from Poshak Fabrics.",
    url: "https://poshakfabrics.org",
    siteName: "Poshak Fabrics",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Poshak Fabrics - Premium Clothing Store in Pakistan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poshak Fabrics | Premium Clothing Store in Pakistan",
    description:
      "Buy premium fabrics, unstitched suits and clothing online from Poshak Fabrics.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://poshakfabrics.org",
  },
  // Uncomment and add your Google Search Console verification code below:
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Poshak Fabrics",
  url: "https://poshakfabrics.org",
  logo: "https://poshakfabrics.org/Logo.png",
  description:
    "Premium ethnic wear brand offering stitched and unstitched fabrics and clothing in Pakistan.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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