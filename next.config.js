/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  basePath: '/megaverse-polynet', // Your repository name
  assetPrefix: '/megaverse-polynet/', // Your repository name with trailing slash
};

module.exports = nextConfig;