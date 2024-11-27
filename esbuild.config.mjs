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
    ],
    outfile: '.next/server/app/page.js',
}).catch(() => process.exit(1))