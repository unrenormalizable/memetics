import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import jsconfigPaths from 'vite-jsconfig-paths'
import tailwindcss from 'tailwindcss'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'memetics',
  version: '0.0.1',
  permissions: ['contextMenus', 'scripting', 'downloads', 'activeTab'],
  icons: {
    16: 'icon-16.png',
    32: 'icon-32.png',
    48: 'icon-48.png',
    64: 'icon-64.png',
    128: 'icon-128.png',
  },
  action: {
    default_popup: 'index.html',
  },
  background: {
    service_worker: 'src/background.js',
    type: 'module',
  },
  content_scripts: [
    {
      js: ['src/content.jsx'],
      matches: ['https://x.com/*', 'https://www.facebook.com/*'],
    },
  ],
})

export default defineConfig({
  plugins: [
    jsconfigPaths(),
    react(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.js'],
  },
})
