const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Don't attempt to bundle node-specific modules on the client side
            config.resolve.fallback = {
                ...config.resolve.fallback,
                "async_hooks": false,
            };
        }
        return config;
    },
    images: {
        unoptimized: true,
        domains: ['res.cloudinary.com'],
    },
    basePath: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : '',
    assetPrefix: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? '' : '',
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve.fallback,
                "#async_hooks": false
            }
        };
        return config;
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