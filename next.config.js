/** @type {import('next').NextConfig} */
const nextConfig = {
 // ...(process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? { output: 'export' } : {}),
 output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  basePath: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '/megaverse-universe' : '',
  assetPrefix: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '/megaverse-universe' : '',
};

module.exports = nextConfig;