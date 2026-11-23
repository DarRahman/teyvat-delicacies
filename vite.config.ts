import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function copyTeyvatAssets() {
  return {
    name: 'copy-teyvat-assets',
    closeBundle() {
      const srcDir = path.resolve(process.cwd(), 'assets');
      const destDir = path.resolve(process.cwd(), 'dist', 'assets');
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyTeyvatAssets()],
  server: {
    port: 3000,
    host: true,
  },
});
