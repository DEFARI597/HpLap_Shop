import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin/dashboard',           
        destination: '/admin/dashboard',
      },
      {
        source: '/admin',
        destination: '/admin/login',
      },
      {
        source: '/register',
        destination: '/user-page/register',
      },
      {
        source: '/login',
        destination: '/user-page/login',
      },
    ];
  },
};

export default nextConfig;
