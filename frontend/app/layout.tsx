// app/layout.tsx
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Poshak Fabrics",
  description: "Poshak Fabrics - Premium Ethnic Wear",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
