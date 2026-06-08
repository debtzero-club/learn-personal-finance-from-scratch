import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Update this to the real domain when it's chosen.
  site: 'https://learnpersonalfinancefromscratch.com',
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
