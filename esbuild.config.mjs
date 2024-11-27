import * as esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['./src/app/page.tsx'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    external: [
        'node:*',
        'async_hooks',
        'node:async_hooks',
        'next',
        'react',
        'react-dom',
        '@next/*',
        'next/*'
    ],
    outfile: '.next/server/app/page.js',
    define: {
        'process.env.NODE_ENV': '"production"',
        'global': 'globalThis',
    },
    allowOverwrite: true,
    inject: ['./src/shims.js'],
}).catch(() => process.exit(1))