const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  basePath: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : '',
};

if (process.env.NODE_ENV === "development") {
  try {
    setupDevPlatform();
  } catch (e) {
    console.warn("Failed to setup dev platform:", e);
  }
  
}

module.exports = nextConfig; 