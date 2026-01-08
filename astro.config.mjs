import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  preview: {
    host: '0.0.0.0',
    port: 4321,
  },
});
