module.exports = {
    // Configure build output
    output: 'standalone',
    // Configure platform
    platform: 'node',
    // Configure build options
    build: {
        // Disable minification for debugging
        minify: false,
        // Configure Node.js polyfills
        polyfills: {
            async_hooks: false,
        },
    },
}