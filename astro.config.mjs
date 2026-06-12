import { defineConfig } from 'astro/config';
import rehypeGlossaryLinks from './src/lib/rehype-glossary-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://learnpersonalfinancefromscratch.com',
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    // In-repo plugin (zero npm deps) — auto-links glossary terms in every lesson body (GLOSS-02).
    rehypePlugins: [rehypeGlossaryLinks],
  },
});
