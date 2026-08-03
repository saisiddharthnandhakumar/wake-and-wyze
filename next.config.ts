import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql", "razorpay"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
