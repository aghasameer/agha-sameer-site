// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: swap in the real domain once it's registered on Namecheap / live on Cloudflare Pages
const SITE_URL = 'https://aghasameer.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
  },
});
