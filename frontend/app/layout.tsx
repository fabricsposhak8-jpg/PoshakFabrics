// app/layout.tsx (SERVER COMPONENT)

import "./globals.css";
import UserProvider from "./context/page";
import LayoutClient from "../components/LayoutClient";

export const metadata = {
  title: "Poshak Fabrics",
  description: "Premium Clothing Store",
  icons: {
    icon: "/Logo.ico",
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
        <UserProvider>
          <LayoutClient>{children}</LayoutClient>
        </UserProvider>
      </body>
    </html>
  );
}