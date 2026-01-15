import { defineConfig } from 'vitest/config';

export const baseVitestConfig = defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.{test,spec}.{ts,tsx}', '**/test/**'],
    },
    passWithNoTests: true,
  },
});

export default baseVitestConfig;
