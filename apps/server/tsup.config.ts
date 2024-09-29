import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: '.out',
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
});
