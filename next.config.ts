import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',

  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    },
    cacheComponents: true
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ui-avatars.com" }
    ]
  },

  // Reduce bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Prisma on client side
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': false,
      };
    }
    return config;
  }
};

export default nextConfig;
