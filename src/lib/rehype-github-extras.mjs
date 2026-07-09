// rehype-github-extras.mjs — strips the GitHub-only reading extras from the
// rendered lesson HTML so the deployed site is unchanged.
//
// scripts/sync-lesson-github-extras.mjs injects, into each lesson body, a leading
// `# <title>` + `> <summary>` header and a trailing `<p class="lesson-md-nav">…</p>`
// footer. Those make the raw .md pleasant to read on GitHub, but the site's
// LessonLayout already renders the title, summary, and prev/next nav — so this plugin
// removes all three from the HTML to avoid duplicates:
//   (a) the FIRST h1 element, only if it is the first element of the document
//   (b) the blockquote immediately following that h1
//   (c) any element with class `lesson-md-nav`
//
// Registered in astro.config.mjs BEFORE rehype-glossary-links so glossary linking never
// walks nodes we're about to drop (and never re-links terms inside the summary).
//
// PIPELINE NOTE: Astro runs user rehype plugins BEFORE rehype-raw (see the note in
// rehype-glossary-links.mjs). So the header h1 and blockquote arrive as real hast
// elements (from markdown `#` / `>`), but the raw-HTML nav arrives as a `raw` node whose
// HTML string has not yet been parsed into an element. We therefore match the nav in
// BOTH forms: an `element` with className `lesson-md-nav` (the shape the tests exercise)
// AND a `raw` node whose value contains class="lesson-md-nav" (the runtime shape) — so
// it is stripped on the site either way.
//
// ZERO npm dependencies BY DESIGN — hand-rolled, mirroring the sibling in-repo plugins.

const NAV_CLASS = 'lesson-md-nav';

const isWhitespaceText = (n) => n && n.type === 'text' && /^\s*$/.test(n.value);

function isNavNode(n) {
  if (!n) return false;
  if (n.type === 'element') {
    const cn = n.properties && n.properties.className;
    const list = Array.isArray(cn) ? cn : cn ? [cn] : [];
    return list.includes(NAV_CLASS);
  }
  if (n.type === 'raw') {
    return new RegExp(`class\\s*=\\s*["']${NAV_CLASS}["']`).test(n.value || '');
  }
  return false;
}

export default function rehypeGithubExtras() {
  return (tree) => {
    if (!tree || !Array.isArray(tree.children)) return;
    const children = tree.children;

    // (a) + (b): a leading `# <title>` followed by a `> <summary>` blockquote.
    const firstElIdx = children.findIndex((n) => n.type === 'element');
    if (firstElIdx !== -1 && children[firstElIdx].tagName === 'h1') {
      let j = firstElIdx + 1;
      while (j < children.length && isWhitespaceText(children[j])) j++;
      const followedByBlockquote =
        j < children.length && children[j].type === 'element' && children[j].tagName === 'blockquote';
      const end = followedByBlockquote ? j : firstElIdx; // inclusive index to remove up to
      children.splice(firstElIdx, end - firstElIdx + 1);
    }

    // (c): the nav — element form or raw-node form, wherever it sits (it is last).
    for (let i = children.length - 1; i >= 0; i--) {
      if (isNavNode(children[i])) children.splice(i, 1);
    }
  };
}
