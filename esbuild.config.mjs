import * as esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['./src/app/page.tsx'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    external: [
        'async_hooks',
        'next',
        'react',
        'react-dom',
        'node:async_hooks',
        'node:*'
    ],
    outfile: '.next/server/app/page.js',
    define: {
        'process.env.NODE_ENV': '"production"'
    },
    allowOverwrite: true,
}).catch(() => process.exit(1))