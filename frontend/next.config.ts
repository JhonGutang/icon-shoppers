import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://icon-shoppers.onrender.com/api/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'https://icon-shoppers.onrender.com/storage/:path*',
      },
    ];
  },
};

export default nextConfig;
