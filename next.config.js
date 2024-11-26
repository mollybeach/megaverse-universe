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
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                async_hooks: false,
                fs: false,
                net: false,
                tls: false,
                child_process: false,
                async_hooks: false,
                'next/dist/compiled/next-server/app-page': false
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