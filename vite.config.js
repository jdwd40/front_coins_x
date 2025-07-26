import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
            '@/components': '/src/components',
            '@/hooks': '/src/hooks',
            '@/utils': '/src/utils',
            '@/types': '/src/types',
            '@/services': '/src/services',
            '@/store': '/src/store',
            '@/pages': '/src/pages',
            '@/config': '/src/config',
            '@/styles': '/src/styles',
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    charts: ['recharts'],
                    forms: ['react-hook-form', 'zod'],
                    routing: ['react-router-dom'],
                    state: ['zustand', '@tanstack/react-query'],
                    ui: ['@headlessui/react', 'lucide-react'],
                },
            },
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://jdwd40.com',
                changeOrigin: true,
                secure: false,
            },
            '/ws': {
                target: 'wss://jdwd40.com',
                ws: true,
                changeOrigin: true,
                secure: false,
            },
        },
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'zustand',
            'react-hook-form',
            'zod',
            'recharts',
            'socket.io-client',
            'lucide-react',
        ],
    },
});
