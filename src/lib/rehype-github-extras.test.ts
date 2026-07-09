// Tests for the in-repo rehype GitHub-extras stripper.
//
// These exercise the plugin against hand-built hast fixtures (plain objects) so no
// unified/remark pipeline is needed — we call the transformer directly:
//   rehypeGithubExtras()(tree)
//
// The stripper removes, from a rendered lesson body: (a) a leading h1, (b) the
// blockquote right after it, and (c) any element with class `lesson-md-nav`.
import { describe, it, expect } from 'vitest';
import rehypeGithubExtras from './rehype-github-extras.mjs';

// --- hast fixture helpers ---------------------------------------------------
const text = (value) => ({ type: 'text', value });
const el = (tagName, children, properties = {}) => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const root = (...children) => ({ type: 'root', children });

const tagsOf = (tree) =>
  tree.children.filter((c) => c.type === 'element').map((c) => c.tagName);

describe('rehypeGithubExtras stripper', () => {
  it('Test 1: strips a leading h1 and the blockquote immediately following it', () => {
    const tree = root(
      el('h1', [text('Compounding, seen')]),
      el('blockquote', [el('p', [text('Watch the snowball happen…')])]),
      el('h2', [text('The situation')]),
      el('p', [text('body')]),
    );
    rehypeGithubExtras()(tree);
    expect(tagsOf(tree)).toEqual(['h2', 'p']);
  });

  it('Test 2: strips the h1 + blockquote even with whitespace text nodes between them', () => {
    // Runtime hast from remark-rehype interleaves "\n" text nodes between block elements.
    const tree = root(
      text('\n'),
      el('h1', [text('Title')]),
      text('\n'),
      el('blockquote', [el('p', [text('summary')])]),
      text('\n'),
      el('h2', [text('The situation')]),
    );
    rehypeGithubExtras()(tree);
    expect(tagsOf(tree)).toEqual(['h2']);
  });

  it('Test 3: strips a nav element carrying the lesson-md-nav class', () => {
    const tree = root(
      el('h2', [text('The situation')]),
      el('p', [text('body')]),
      el('p', [el('a', [text('Contents')], { href: '../../../README.md#curriculum' })], {
        className: ['lesson-md-nav'],
      }),
    );
    rehypeGithubExtras()(tree);
    expect(tagsOf(tree)).toEqual(['h2', 'p']);
  });

  it('Test 4: strips the nav in its runtime raw-node form (pre rehype-raw)', () => {
    const tree = root(
      el('h2', [text('The situation')]),
      { type: 'raw', value: '<p class="lesson-md-nav"><a href="./x.md">Contents</a></p>' },
    );
    rehypeGithubExtras()(tree);
    expect(tree.children.some((c) => c.type === 'raw')).toBe(false);
    expect(tagsOf(tree)).toEqual(['h2']);
  });

  it('Test 5: a lesson body WITHOUT the extras passes through unchanged', () => {
    const tree = root(
      el('h2', [text('The situation')]),
      el('p', [text('body')]),
      el('h2', [text('The idea')]),
    );
    const before = JSON.stringify(tree);
    rehypeGithubExtras()(tree);
    expect(JSON.stringify(tree)).toBe(before);
  });

  it('Test 6: an h1 that is NOT the first element is kept', () => {
    const tree = root(
      el('p', [text('intro')]),
      el('h1', [text('A mid-document heading')]),
      el('blockquote', [el('p', [text('a real quote, not a summary')])]),
    );
    rehypeGithubExtras()(tree);
    expect(tagsOf(tree)).toEqual(['p', 'h1', 'blockquote']);
  });

  it('Test 7: a leading h1 with no following blockquote strips only the h1', () => {
    const tree = root(el('h1', [text('Title')]), el('h2', [text('The situation')]));
    rehypeGithubExtras()(tree);
    expect(tagsOf(tree)).toEqual(['h2']);
  });
});
