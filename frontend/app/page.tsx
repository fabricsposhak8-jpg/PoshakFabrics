import React from "react";
import { FiShoppingBag, FiMenu, FiSearch, FiArrowRight } from "react-icons/fi";

// --- DATA SECTION ---
// Stable images sourced from Unsplash
const CATEGORIES = [
  {
    name: "Pure Silk",
    image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Organic Cotton",
    image: "https://images.unsplash.com/photo-1598555620868-b7a42168974a?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Premium Linen",
    image: "https://images.unsplash.com/photo-1575459078696-6e2d93e254e2?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Velvet",
    image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=800"
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Midnight Blue Chiffon",
    price: "$24.00/yd",
    image: "https://images.unsplash.com/photo-1612012658428-b0728c03eac7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    name: "Floral Print Rayon",
    price: "$18.50/yd",
    image: "https://images.unsplash.com/photo-1550927409-7754b2b2518e?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    name: "Emerald Green Satin",
    price: "$32.00/yd",
    image: "https://images.unsplash.com/photo-1563294020-c247385392bc?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    name: "Raw Textured Wool",
    price: "$45.00/yd",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans dark:bg-black dark:text-zinc-100">

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Mobile Menu Icon */}
          <button className="md:hidden">
            <FiMenu className="text-2xl" />
          </button>

          {/* Logo */}
          <div className="text-2xl font-bold tracking-tighter cursor-pointer">
            FABRIC<span className="text-blue-600">OS</span>.
          </div>

          {/* Desktop Links */}
          <div className="hidden space-x-8 font-medium md:flex">
            <a href="#" className="hover:text-blue-600 transition-colors">New Arrivals</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Shop Fabrics</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Patterns</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Sale</a>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <FiSearch className="cursor-pointer text-xl hover:text-blue-600 transition-colors" />
            <div className="relative cursor-pointer group">
              <FiShoppingBag className="text-xl group-hover:text-blue-600 transition-colors" />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">2</span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[500px] w-full md:h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558230687-f8c5b9f71c1b?auto=format&fit=crop&q=80&w=2000"
            alt="Fabric Background"
            className="h-full w-full object-cover brightness-[0.6]"
          />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Weave Your <span className="text-blue-400">Masterpiece</span>.
          </h1>
          <p className="mb-8 max-w-xl text-lg text-zinc-200 md:text-xl">
            Premium textiles sourced from around the globe.
            From Italian silk to Egyptian cotton, find the perfect thread for your next project.
          </p>
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-black transition-transform hover:scale-105 active:scale-95">
            Shop Collection
          </button>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg cursor-pointer">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-xl font-medium text-white">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Trending Fabrics</h2>
            <a href="#" className="flex items-center gap-2 font-medium text-blue-600 hover:underline">
              View all <FiArrowRight />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative mb-4 overflow-hidden rounded-lg bg-zinc-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button className="absolute bottom-4 right-4 translate-y-10 rounded-full bg-white p-3 text-black shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-blue-600 hover:text-white">
                    <FiShoppingBag />
                  </button>
                </div>
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
          <div>
            <div className="mb-4 text-xl font-bold">FABRICOS.</div>
            <p className="text-sm text-zinc-500">
              Quality fabrics for fashion designers, hobbyists, and interior decorators.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-600">New Arrivals</a></li>
              <li><a href="#" className="hover:text-blue-600">Best Sellers</a></li>
              <li><a href="#" className="hover:text-blue-600">Sale</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Help</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-600">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-blue-600">Fabric Care Guide</a></li>
              <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-zinc-700"
              />
              <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black">
                Join
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}