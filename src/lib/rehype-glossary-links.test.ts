// Tests for the in-repo rehype glossary auto-linker (GLOSS-02).
//
// These exercise the plugin against hand-built hast fixtures (plain objects) so
// no unified/remark pipeline is needed — we call the transformer directly:
//   rehypeGlossaryLinks()(tree)
//
// The .mjs plugin imports { glossary, termSlug } from '../data/glossary.ts'.
import { describe, it, expect } from 'vitest';
import rehypeGlossaryLinks, { buildMatchers } from './rehype-glossary-links.mjs';
import { glossary, termSlug } from '../data/glossary.ts';

// --- hast fixture helpers ---------------------------------------------------
const text = (value) => ({ type: 'text', value });
const el = (tagName, children, properties = {}) => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const root = (...children) => ({ type: 'root', children });

/** Find the first <a class="glossary-link"> anywhere in the tree. */
function findLinks(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (
    node.type === 'element' &&
    node.tagName === 'a' &&
    Array.isArray(node.properties?.className) &&
    node.properties.className.includes('glossary-link')
  ) {
    acc.push(node);
  }
  for (const c of node.children || []) findLinks(c, acc);
  return acc;
}

/** Concatenate all text under a node (link labels are single text children). */
function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(textOf).join('');
}

describe('termSlug', () => {
  it('Test 1: produces a unique slug for every glossary term', () => {
    const slugs = glossary.map((t) => termSlug(t.term));
    expect(new Set(slugs).size).toBe(glossary.length);
  });
});

describe('buildMatchers', () => {
  it('Test 2: expands an acronym paren term into both aliases → one slug', () => {
    const { pattern, slugFor } = buildMatchers(glossary);
    expect('APR'.match(pattern)).not.toBeNull();
    expect('Annual Percentage Rate'.match(pattern)).not.toBeNull();
    expect(slugFor('APR')).toBe('apr-annual-percentage-rate');
    expect(slugFor('Annual Percentage Rate')).toBe('apr-annual-percentage-rate');
  });
});

describe('rehypeGlossaryLinks transformer', () => {
  it('Test 3: links a term inside a paragraph, preserving surrounding text', () => {
    const tree = root(el('p', [text('Your APR matters.')]));
    rehypeGlossaryLinks()(tree);
    const p = tree.children[0];
    // before-text, <a>, after-text
    expect(p.children.length).toBe(3);
    expect(p.children[0]).toEqual(text('Your '));
    const a = p.children[1];
    expect(a.type).toBe('element');
    expect(a.tagName).toBe('a');
    expect(a.properties.href).toBe('/glossary#apr-annual-percentage-rate');
    expect(a.properties.className).toContain('glossary-link');
    expect(textOf(a)).toBe('APR'); // original casing kept
    expect(p.children[2]).toEqual(text(' matters.'));
  });

  it('Test 4: links only the first occurrence of a term in a tree', () => {
    const tree = root(
      el('p', [text('APR here.')]),
      el('p', [text('APR again here.')]),
    );
    rehypeGlossaryLinks()(tree);
    const links = findLinks(tree);
    const aprLinks = links.filter(
      (a) => a.properties.href === '/glossary#apr-annual-percentage-rate',
    );
    expect(aprLinks.length).toBe(1);
  });

  it('Test 5: never links text inside h2, code, pre, or an existing <a>', () => {
    const tree = root(
      el('h2', [text('APR explained')]),
      el('pre', [el('code', [text('APR')])]),
      el('p', [el('a', [text('APR')], { href: '/somewhere' })]),
    );
    rehypeGlossaryLinks()(tree);
    expect(findLinks(tree).length).toBe(0);
  });

  it('Test 6: per-file state — same transformer links the term in two trees', () => {
    const plugin = rehypeGlossaryLinks();
    const t1 = root(el('p', [text('APR one.')]));
    const t2 = root(el('p', [text('APR two.')]));
    plugin(t1);
    plugin(t2);
    expect(findLinks(t1).length).toBe(1);
    expect(findLinks(t2).length).toBe(1);
  });

  it('Test 7: bare "Credit" skipped, "Credit utilization" still links', () => {
    const tree = root(el('p', [text('Use your credit card wisely.')]));
    rehypeGlossaryLinks()(tree);
    expect(findLinks(tree).length).toBe(0);

    const tree2 = root(el('p', [text('Keep your credit utilization low.')]));
    rehypeGlossaryLinks()(tree2);
    const links2 = findLinks(tree2);
    expect(links2.length).toBe(1);
    expect(links2[0].properties.href).toBe(
      '/glossary#' + termSlug('Credit utilization'),
    );
  });

  it('Test 8: a vs.-composite override links to the combined slug', () => {
    const tree = root(el('p', [text('a hard inquiry dings your score')]));
    rehypeGlossaryLinks()(tree);
    const links = findLinks(tree);
    expect(links.length).toBe(1);
    expect(links[0].properties.href).toBe(
      '/glossary#' + termSlug('Hard vs. soft inquiry'),
    );
  });

  it('Test 9: a plural matches the singular term slug', () => {
    const tree = root(el('p', [text('Build sinking funds for known costs.')]));
    rehypeGlossaryLinks()(tree);
    const links = findLinks(tree);
    expect(links.length).toBe(1);
    expect(links[0].properties.href).toBe('/glossary#' + termSlug('Sinking fund'));
  });

  it('Test 10: raw nodes are skipped without throwing', () => {
    const tree = root(
      { type: 'raw', value: '<div>APR</div>' },
      el('p', [text('plain text, no term')]),
    );
    expect(() => rehypeGlossaryLinks()(tree)).not.toThrow();
    expect(findLinks(tree).length).toBe(0);
  });
});
