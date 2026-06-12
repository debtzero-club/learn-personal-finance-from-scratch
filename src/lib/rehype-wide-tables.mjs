// rehype-wide-tables.mjs — D-16 two-tier-width support.
//
// Registered in astro.config.mjs AFTER rehypeGlossaryLinks. It tags every
// data-heavy lesson table (>= 5 columns in its first row) with the `table-wide`
// class so the global.css @media (min-width:1100px) breakout rule can widen it
// to --max-wide (~1000px) while prose stays at the 760px reading measure. The
// content audit (06-RESEARCH §Pattern 4) found exactly one qualifying table
// today: 8-1-types-of-debt (5 columns); everything else (<= 4 cols) stays 760px.
//
// ZERO npm dependencies BY DESIGN — the hand-rolled hast walker mirrors
// rehype-glossary-links.mjs; we do NOT pull in unist-util-visit / hast-util-*.

export default function rehypeWideTables() {
  return (tree) => {
    function walk(node) {
      if (!node || !Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName === 'table') tagIfWide(child);
        else walk(child);
      }
    }

    function firstRow(node) {
      if (!node || !Array.isArray(node.children)) return null;
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName === 'tr') return child;
        const found = firstRow(child); // descend through thead/tbody
        if (found) return found;
      }
      return null;
    }

    function tagIfWide(table) {
      const row = firstRow(table);
      if (!row || !Array.isArray(row.children)) return;
      let cols = 0;
      for (const cell of row.children) {
        if (cell.type === 'element' && (cell.tagName === 'th' || cell.tagName === 'td')) cols++;
      }
      if (cols < 5) return;
      table.properties = table.properties || {};
      const cn = table.properties.className;
      table.properties.className = Array.isArray(cn) ? [...cn, 'table-wide'] : ['table-wide'];
    }

    walk(tree);
  };
}
