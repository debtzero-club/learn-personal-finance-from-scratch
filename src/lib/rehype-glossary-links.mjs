// rehype-glossary-links.mjs — GLOSS-02 in-lesson glossary auto-linker.
//
// Registered in astro.config.mjs as markdown.rehypePlugins: [rehypeGlossaryLinks].
// It links the FIRST occurrence of each glossary term in every lesson body to its
// anchored definition on /glossary (href="/glossary#<slug>" → id="<slug>").
//
// Pipeline facts (06-RESEARCH.md):
//   - Runs AFTER remark-rehype + shiki and BEFORE rehype-raw, so headings are
//     h1–h6 elements, code is pre/code, markdown links are <a> — exclusion is a
//     simple ancestor-tag check. Raw HTML is invisible to this plugin (and there
//     is currently zero raw HTML across all 92 lessons); raw nodes are skipped.
//   - ONE markdown processor is reused for all 92 files, so per-lesson state (the
//     `seen` set) MUST live inside the returned transformer, not in the factory.
//
// ZERO npm dependencies BY DESIGN. The only import is the glossary itself; we do
// NOT pull in unist-util-visit / hast-util-* (phantom deps) — the ~20-line walker
// is hand-rolled below. The `.ts` extension on the import is MANDATORY under
// Node 24's ESM resolver (same rule as scripts/validate-content.mjs).
import { glossary, termSlug } from '../data/glossary.ts';

// Terms whose default alias derivation reads wrong in prose. An empty aliases
// array means "never auto-link this term". Audited against all 88 glossary terms.
const OVERRIDES = {
  Credit: { aliases: [] }, // bare word — links inside "credit card" read wrong
  'Term (of a loan)': { aliases: ['loan term', 'term of a loan', 'term of the loan'] },
  'Deductible (insurance)': { aliases: ['deductible'] },
  'Capitalization (student loans)': { aliases: ['capitalization'] },
  'Marginal vs. effective tax rate': { aliases: ['marginal tax rate', 'effective tax rate'] },
  'Hard vs. soft inquiry': { aliases: ['hard inquiry', 'soft inquiry'] },
  'Secured vs. unsecured debt': { aliases: ['secured debt', 'unsecured debt'] },
  'Subsidized vs. unsubsidized loans': { aliases: ['subsidized loan', 'unsubsidized loan'] },
  'Tax refund vs. liability': { aliases: ['tax refund', 'tax liability'] },
  '1099 / Independent contractor': { aliases: ['independent contractor', '1099 worker'] }, // never bare "1099"
  'Roth account': { aliases: ['Roth account', 'Roth IRA'] },
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');

/** Does the trailing-paren content look like an acronym/abbreviation we should
 *  expose as its own alias (e.g. "(APR)", "(HSA)") rather than a qualifier
 *  (e.g. "(insurance)", "(student loans)")? */
function looksLikeAcronym(base, paren) {
  if (!/^[A-Z0-9][A-Za-z0-9 ,]*$/.test(paren)) return false;
  if (paren.length <= 6) return true; // APR, HSA, 2FA, BNPL, HDHP...
  // Title-Case expansion of the base, e.g. PSLF (Public Service Loan Forgiveness)
  return /^[A-Z]/.test(paren) && paren.split(' ').every((w) => /^[A-Z0-9]/.test(w));
}

/** Derive the prose aliases for a single glossary term. */
function aliasesFor(term) {
  if (Object.prototype.hasOwnProperty.call(OVERRIDES, term)) {
    return OVERRIDES[term].aliases;
  }
  const m = term.match(/^(.*\S)\s*\(([^)]+)\)$/);
  if (m) {
    const base = m[1];
    const paren = m[2];
    return looksLikeAcronym(base, paren) ? [base, paren] : [base];
  }
  return [term];
}

/**
 * buildMatchers(terms) → { pattern, slugFor }
 *  - pattern: one case-insensitive global regex matching any alias (optionally
 *    pluralized), alternation sorted LONGEST-FIRST so the longest term wins.
 *  - slugFor(matchedText): maps a matched string back to its glossary slug,
 *    retrying with trailing 's'/'es' stripped for plurals.
 */
export function buildMatchers(terms) {
  const aliasToSlug = new Map(); // lowercased alias -> slug
  const aliasList = [];
  for (const t of terms) {
    const slug = termSlug(t.term);
    for (const alias of aliasesFor(t.term)) {
      const key = alias.toLowerCase();
      if (!aliasToSlug.has(key)) {
        aliasToSlug.set(key, slug);
        aliasList.push(alias);
      }
    }
  }
  // Longest alias first → in a regex alternation the first matching branch wins,
  // so "credit utilization" beats a hypothetical bare "credit".
  aliasList.sort((a, b) => b.length - a.length);
  const body = aliasList.map((a) => `\\b${escapeRe(a)}(?:s|es)?\\b`).join('|');
  const pattern = new RegExp(body, 'gi');

  function slugFor(matchedText) {
    const lower = matchedText.toLowerCase();
    if (aliasToSlug.has(lower)) return aliasToSlug.get(lower);
    if (lower.endsWith('es') && aliasToSlug.has(lower.slice(0, -2))) {
      return aliasToSlug.get(lower.slice(0, -2));
    }
    if (lower.endsWith('s') && aliasToSlug.has(lower.slice(0, -1))) {
      return aliasToSlug.get(lower.slice(0, -1));
    }
    return null;
  }

  return { pattern, slugFor };
}

// Tags whose text must never be linked: existing links, code, headings, scripts.
const SKIP = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style']);

export default function rehypeGlossaryLinks() {
  const { pattern, slugFor } = buildMatchers(glossary);

  return (tree) => {
    const seen = new Set(); // PER FILE — must live here, not in the factory.

    function walk(node) {
      if (!node || !Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'element') {
          if (!SKIP.has(child.tagName)) walk(child);
        } else if (child.type === 'text') {
          i += linkify(node, i, child); // skip past any inserted nodes
        }
        // raw / comment / other node types: skip silently.
      }
    }

    function linkify(parent, index, textNode) {
      const value = textNode.value;
      pattern.lastIndex = 0;
      const out = [];
      let last = 0;
      let inserted = 0;
      let m;
      while ((m = pattern.exec(value)) !== null) {
        const matched = m[0];
        const slug = slugFor(matched);
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
        out.push({
          type: 'element',
          tagName: 'a',
          properties: { href: `/glossary#${slug}`, className: ['glossary-link'] },
          children: [{ type: 'text', value: matched }], // preserve prose casing
        });
        last = m.index + matched.length;
      }
      if (out.length === 0) return 0; // nothing linked — leave the text node as-is
      if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
      parent.children.splice(index, 1, ...out);
      inserted = out.length - 1; // we replaced 1 node with out.length nodes
      return inserted;
    }

    walk(tree);
  };
}
