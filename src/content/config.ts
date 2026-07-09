import { defineCollection, z } from 'astro:content';
import { CALCULATOR_NAMES } from '../data/calculators';

/**
 * Every lesson is one markdown file in src/content/lessons/.
 * The frontmatter below enforces the "lesson loop" structurally:
 * the markdown body holds The Situation / The Idea / By the Numbers,
 * and these fields hold Do It, Check Yourself (quiz), and Keep This.
 * See CONTRIBUTING.md → "How to add or edit a lesson".
 */
const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(), // e.g. "1.1" — must match the id in src/data/curriculum.ts
    track: z.number().int(),
    phase: z.number().int(),
    order: z.number().int(), // position within the phase
    title: z.string(),
    summary: z.string(),
    status: z.enum(['complete', 'draft', 'planned']).default('complete'),
    mechanics: z.boolean().default(false), // the ⚙ "how it actually works" flag
    lastReviewed: z.string(), // ISO date, e.g. "2026-06-07"
    doIt: z.string(), // the one concrete action (the behavior-change lever)
    keepThis: z.string(), // the one takeaway/number to remember
    quiz: z
      .array(
        z.object({
          q: z.string(),
          options: z.array(z.string()).min(2),
          answer: z.number().int(), // index of the correct option
          explain: z.string().optional(),
        })
      )
      .default([]),
    sources: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    // numbers.ts keys this lesson's prose depends on (validated by scripts/validate-content.mjs)
    figures: z.array(z.string()).default([]),
    // Optional interactive calculator island this lesson embeds. A z.enum (NOT z.string)
    // so a typo'd name is a Zod build error for free — complementing the validator's
    // resolves-to-registered name-check (D-03). The enum is DERIVED from the single
    // source of truth (src/data/calculators.ts), which the LessonLayout CALCULATORS
    // registry and scripts/validate-content.mjs also consume (Phase 4 D-14, now
    // one-source-of-truth instead of THREE-PLACES-IN-SYNC).
    calculator: z.enum(CALCULATOR_NAMES).optional(),
  }),
});

export const collections = { lessons };
