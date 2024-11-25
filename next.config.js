const nextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  basePath: '/megaverse-polynet', // Your repository name
  assetPrefix: '/megaverse-polynet/', // Your repository name with trailing slash
};

export default nextConfig;