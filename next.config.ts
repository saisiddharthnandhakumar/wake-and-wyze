import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
