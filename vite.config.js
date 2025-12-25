import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

// Read config.json so Vite builds/dev uses the same Cloudbase env as Electron
let configEnv = 'your-environment-id';
try {
  const cfgRaw = fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8');
  const cfg = JSON.parse(cfgRaw);
  if (cfg && cfg.cloudbaseEnv) {
    configEnv = cfg.cloudbaseEnv;
  }
} catch (e) {
  // fallback to existing env or placeholder
  console.warn('Could not read config.json for Vite define:', e.message);
}

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
  define: {
    // Make import.meta.env.VITE_CLOUDBASE_ENV available at build-time
    'import.meta.env.VITE_CLOUDBASE_ENV': JSON.stringify(configEnv),
  },
});
