const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
        domains: ['res.cloudinary.com'],
    },
    basePath: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : '',
    assetPrefix: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : '',
    experimental: {
        serverActions: true,
    },
    // Add Cloudflare specific configuration
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                async_hooks: false,
            };
        }
        return config;
    },
};

if (process.env.NODE_ENV === "development") {
    try {
        setupDevPlatform();
    } catch (e) {
        console.warn("Failed to setup dev platform:", e);
    }

}

module.exports = nextConfig;