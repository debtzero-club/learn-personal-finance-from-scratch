import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeGithubExtras from './src/lib/rehype-github-extras.mjs';
import rehypeGlossaryLinks from './src/lib/rehype-glossary-links.mjs';
import rehypeWideTables from './src/lib/rehype-wide-tables.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://learnpersonalfinancefromscratch.com',
  // @astrojs/sitemap is a dev dep (build-time only, keeps zero-runtime-deps posture) —
  // emits sitemap-index.xml + sitemap-0.xml from the static routes at build time.
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    // In-repo plugins (zero npm deps), in order: strip the GitHub-only reading
    // extras (h1 + summary blockquote + .lesson-md-nav) that
    // scripts/sync-lesson-github-extras.mjs injects into each lesson body — FIRST, so
    // glossary linking never walks soon-to-be-removed nodes; then auto-link glossary
    // terms (GLOSS-02); then tag >=5-column tables with .table-wide for the D-16
    // 1000px breakout tier.
    rehypePlugins: [rehypeGithubExtras, rehypeGlossaryLinks, rehypeWideTables],
  },
});
