import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',

  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  },

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Empty config to silence the warning
    // Turbopack automatically handles Prisma optimization
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ui-avatars.com" }
    ]
  }
};

export default nextConfig;
