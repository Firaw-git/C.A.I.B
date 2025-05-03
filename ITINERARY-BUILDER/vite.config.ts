import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { configDefaults } from 'vitest/config';

// 👇 Add this import for HTML env support
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  // 👇 Load .env variables
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      // 👇 Inject VITE variables into index.html
      createHtmlPlugin({
        inject: {
          data: {
            VITE_GOOGLE_MAPS_API_KEY: env.VITE_GOOGLE_MAPS_API_KEY
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
      exclude: [...configDefaults.exclude, 'e2e/*'],
    },
  };
});
