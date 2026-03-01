import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oweufwhxnpjhdzpdqmsy.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'jwgtjfmwlnttjdvycuqj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    minimumCacheTTL: 86400,
    // Add unoptimized for development if timeouts persist
    // unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
