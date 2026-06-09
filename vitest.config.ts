/// <reference types="vitest/config" />
// Source: https://docs.astro.build/en/guides/testing/
// getViteConfig reuses the project's Astro/Vite resolver so test imports
// resolve identically to the build. include glob keeps tests co-located.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
