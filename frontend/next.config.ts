import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "poshak-fabrics.vercel.app", // your frontend domain
      "localhost",                  // if you test locally
      "your-backend-domain.com",    // replace with your backend if serving images from API
    ],
  },
};

export default nextConfig;