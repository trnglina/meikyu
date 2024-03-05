import { sveltekit } from '@sveltejs/kit/vite';
import license from 'rollup-plugin-license';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  clearScreen: false,
  plugins: [
    sveltekit(),
    license({
      thirdParty: {
        output: {
          file: './src/routes/third-party/licenses.json',
          template(dependencies) {
            return JSON.stringify(dependencies);
          },
        },
      },
    }),
  ],
  server: {
    fs: {
      allow: ['./config', './strings'],
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.ts'],
  },
});
