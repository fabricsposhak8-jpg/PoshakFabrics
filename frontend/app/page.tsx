"use client"
import { useEffect, useState } from "react";
import ContactUs from "@/components/ContactUs";
import Slider from "@/components/Slider";
import CollectionsPreview from "@/components/CollectionsPreview";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";

interface FabricDetail {
  [key: string]: any;
}

interface ProductImage {
  [key: string]: any;
}

export interface SaleData {
  id: number;
  product_id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  after_discou: string;
  discount_perc: string;
  currency: string;
  stock: number;
  type: string;
  type_gender: string;
  status: string;
  is_active: boolean;
  headline: string;
  sale_discount_percentage: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  fabric_details: FabricDetail[];
  images: ProductImage[];
}

const Page = () => {
  const [sale, setSale] = useState<SaleData[] | null>(null);


  useEffect(() => {
    const fetchHeadline = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sale/getsale`);
        const data = await res.json();
        if (data && data.response) {
          console.log(data.response);
          setSale(data.response);
        }
      } catch (err) {
        console.error("Failed to fetch sale data", err);
      }
    };

    fetchHeadline();
  }, []);

  return (
    <div className="w-full">
      {/* ── Premium Sale Marquee Banner ── */}
      {sale && sale.length > 0 && sale[0].headline && (
        <div className="relative overflow-hidden border-y border-[#C19344]/30 bg-[#0a0a0a] py-3.5 group shadow-2xl">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C19344]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-12 relative z-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 whitespace-nowrap text-sm md:text-base font-bold tracking-[0.25em] uppercase text-[#f5d78e] drop-shadow-[0_0_8px_rgba(193,147,68,0.3)]"
              >
                <span className="text-[#C19344] text-xl animate-pulse">✦</span>
                <span className="font-serif italic">{sale[0].headline}</span>
                <span className="text-[#C19344] text-xl animate-pulse">✦</span>
              </div>
            ))}
          </div>

          {/* Luxury Fade Edges */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20" />

          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] overflow-hidden group">
        <img
          src="/Home1.png"
          alt="Premium Fabric Collection"
          className="w-full h-full object-cover object-center sm:object-top "
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 flex flex-col justify-center items-center text-center px-6 md:px-12">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 border border-[#C19344]/50 rounded-full bg-black/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C19344] animate-ping"></span>
            <span className="text-[#C19344] text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">New Season Collection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-none italic">
            POSHAK <span className="text-[#C19344] text-stroke-white"> FABRICS</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-lg">
            Discover our curated selection of artisanal fabrics that blend centuries of tradition with contemporary luxury.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <Link
              href="#collections"
              className="bg-[#C19344] text-white font-black px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 w-full sm:w-auto shadow-2xl shadow-[#C19344]/20 uppercase text-xs tracking-widest">
              Explore Collections
            </Link>
            <Link
              href="/user/sale"
              className="px-10 py-4 rounded-full border border-white/50 text-white font-black hover:bg-white/10 transition-all duration-500 w-full sm:w-auto uppercase text-xs tracking-widest backdrop-blur-sm">
              Flash Offers
            </Link>
          </div>
        </div>
      </div>

      {/* ── Premium Flash Sale Section ── */}
      {sale && sale.length > 0 && (
        <section className="py-8 bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-[2px] w-8 bg-[#C19344]"></div>
                  <span className="text-[#C19344] text-xs font-black uppercase tracking-[0.4em]">Limited Edition</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 italic uppercase">
                  Flash <span className="text-[#C19344]">Offers</span>
                </h2>
                <p className="text-gray-500 mt-4 text-sm md:text-base font-medium">
                  Exclusive price reductions on our most coveted handcrafted fabrics. Available for a limited time only.
                </p>
              </div>

              <Link href="/user/sale" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-gray-900 hover:text-[#C19344] transition-all duration-300">
                <span>View Full Collection</span>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#C19344] transition-colors">
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-8 hide-scrollbar snap-x snap-mandatory">
              {sale.map((product) => {
                const original = parseFloat(product.price || "0");
                const discount = product.sale_discount_percentage || 0;
                const finalPrice = original - (original * discount / 100);

                return (
                  <div
                    key={product.product_id}
                    className="min-w-[280px] md:min-w-[320px] bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 snap-start flex-shrink-0 group overflow-hidden"
                  >
                    {/* Premium Image Container */}
                    <div className="h-80 w-full overflow-hidden relative bg-gray-50">
                      <img
                        src={product.images?.[0]?.url || "/Home1.png"}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                        alt={product.name}
                      />

                      {/* Luxury Badge */}
                      <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C19344]"></span>
                        {discount}% OFF
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-[#C19344] uppercase font-black tracking-[0.3em]">
                          {product.brand}
                        </p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">In Stock</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#C19344] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Price Section */}
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-gray-900">
                            Rs.{finalPrice.toLocaleString()}
                          </span>
                          <span className="text-xs line-through text-gray-400 font-medium">
                            Rs.{original.toLocaleString()}
                          </span>
                        </div>

                      </div>

                      {/* Premium Button */}
                      <Link
                        href={`/user/collections/${product.type}/${product.product_id}`}
                        className="mt-4 w-full py-4 text-center text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl bg-gray-900 text-white hover:bg-[#C19344] transition-all duration-500 shadow-xl shadow-gray-200 active:scale-95"
                      >
                        View Detail
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* Slider Section */}
      <div className="my-8 md:my-12 lg:my-16">
        <Slider />
      </div>

      {/* Chatbot */}
      <Chatbot />

      {/* Collections Preview Section */}
      <CollectionsPreview gender="female" />
      <CollectionsPreview gender="male" />

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8">
          About Us
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto leading-relaxed">
          Poshak Fabrics is a premium ethnic wear brand that offers a unique blend
          of traditional and modern design. Our fabrics are handcrafted with care
          and attention to detail, ensuring that each piece is a work of art. We
          are committed to providing our customers with the best possible
          experience, and we are always striving to improve our products and
          services.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-2 md:py-4 lg:py-6 px-4 md:px-8 lg:px-16">
        <ContactUs />
      </section>
    </div>
  );
};

export default Page;