import { defineConfig } from 'astro/config';
import rehypeGlossaryLinks from './src/lib/rehype-glossary-links.mjs';
import rehypeWideTables from './src/lib/rehype-wide-tables.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://learnpersonalfinancefromscratch.com',
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    // In-repo plugins (zero npm deps): auto-link glossary terms (GLOSS-02), then
    // tag >=5-column tables with .table-wide for the D-16 1000px breakout tier.
    rehypePlugins: [rehypeGlossaryLinks, rehypeWideTables],
  },
});
