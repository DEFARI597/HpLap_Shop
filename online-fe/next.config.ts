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
        source: '/admin/users',
        destination: '/admin/users',
      },
      {
        source: '/admin/categories',
        destination: '/admin/categories',
      },
      {
        source: '/admin/categories/add-categories',
        destination: '/admin/categories/add-categories'
      },
      {
        source: '/admin/product',
        destination: '/admin/product'
      },
      {
        source: '/admin/product/add-product',
        destination: '/admin/product/add-product'
      },
      {
        source: '/register',
        destination: '/users/register',
      },
      {
        source: '/login',
        destination: '/users/login',
      },
    ];
  },
};

export default nextConfig;
