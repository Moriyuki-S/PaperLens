import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['src/tests/setup.ts'],
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.test.ts',
                'src/**/*.test.tsx',
                'src/tests/**',
                'src/vite-env.d.ts',
            ],
        },
    },
});
