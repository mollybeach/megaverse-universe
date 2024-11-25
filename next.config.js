const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  }
};

if (process.env.NODE_ENV === "development") {
  try {
    setupDevPlatform();
  } catch (e) {
    console.warn("Failed to setup dev platform:", e);
  }
}

module.exports = nextConfig; 