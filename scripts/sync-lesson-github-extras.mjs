// scripts/sync-lesson-github-extras.mjs — make each lesson .md pleasant to read
// directly on GitHub, WITHOUT changing what the deployed site renders.
//
// WHAT IT DOES: every lesson body normally starts at "## The situation", so the raw
// file opens abruptly on GitHub (the site pulls title/summary/prev-next from
// frontmatter, but GitHub shows the raw markdown). This script injects two
// GitHub-only "reading extras" into every lesson body and keeps them in sync with
// the frontmatter + curriculum:
//   1. a header:  `# <title>` then a `> <summary>` blockquote (from frontmatter)
//   2. a footer:  one raw-HTML `<p class="lesson-md-nav">` with prev · Contents · next
//      links, in curriculum order across ALL phases/tracks (the same order the site
//      uses in src/pages/lessons/[...slug].astro).
//
// The companion site-side plugin src/lib/rehype-github-extras.mjs strips all three
// (h1, blockquote, .lesson-md-nav) from the rendered HTML, so the live site is
// unchanged — no duplicate title/summary/nav there.
//
// IDEMPOTENT: it strips any previously-generated header/footer before re-inserting
// fresh ones, so running twice is a no-op, and a frontmatter title/summary edit
// followed by a re-run updates the body header. Only the generated header/footer are
// touched — lesson prose is never reworded.
//
// ZERO DEPENDENCIES. It imports curriculum.ts with Node 24's native type-stripping,
// same pattern as scripts/validate-content.mjs. The `.ts` extension is MANDATORY.

import { allLessons } from '../src/data/curriculum.ts'; // .ts extension REQUIRED (Node 24)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const LESSON_DIR = fileURLToPath(new URL('../src/content/lessons/', import.meta.url));
// Lesson files live at src/content/lessons/<slug>.md; README.md is at the repo root,
// three directories up. GitHub renders `## Curriculum` as the `#curriculum` anchor.
const CONTENTS_HREF = '../../../README.md#curriculum';
const NAV_CLASS = 'lesson-md-nav';

// Same numeric id comparator the site uses (getStaticPaths in [...slug].astro).
function cmpId(a, b) {
  const [a1, a2] = a.split('.').map(Number);
  const [b1, b2] = b.split('.').map(Number);
  return a1 - b1 || a2 - b2;
}

// --- frontmatter field reader (NO YAML dependency) -------------------------
// Reads a single-line scalar (`key: <value>`) from the frontmatter block and
// unwraps a YAML double- or single-quoted string. Lesson titles use double quotes
// with `\"` escapes (e.g. 6-5, 1-3, 14-6); summaries are plain double-quoted.
function parseYamlScalar(raw) {
  const s = raw.trim();
  if (s.startsWith('"')) {
    const inner = s.slice(1, s.lastIndexOf('"'));
    return inner.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (s.startsWith("'")) {
    const inner = s.slice(1, s.lastIndexOf("'"));
    return inner.replace(/''/g, "'");
  }
  return s;
}

function readField(block, key) {
  const m = block.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  return m ? parseYamlScalar(m[1]) : null;
}

// Escape text destined for HTML text content (the nav link labels).
const htmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- header / footer builders ----------------------------------------------
function buildHeader(title, summary) {
  return `# ${title}\n\n> ${summary}`;
}

function buildFooter(prev, next) {
  const parts = [];
  if (prev) {
    parts.push(`<a href="./${prev.slug}.md">← ${htmlEscape(prev.id)} ${htmlEscape(prev.title)}</a>`);
  }
  parts.push(`<a href="${CONTENTS_HREF}">Contents</a>`);
  if (next) {
    parts.push(`<a href="./${next.slug}.md">${htmlEscape(next.id)} ${htmlEscape(next.title)} →</a>`);
  }
  return `<p class="${NAV_CLASS}">${parts.join(' · ')}</p>`;
}

// --- idempotent strip of a previously-generated header / footer -------------
// Header = a leading `# ` line (exactly one hash — lesson sections use `## `),
// its blank lines, and the following `> ` blockquote lines. Body prose never
// legitimately starts with an h1 or a blockquote, so this only ever removes ours.
function stripHeader(lines) {
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i >= lines.length || !/^# /.test(lines[i])) return lines;
  i++; // consume the h1
  while (i < lines.length && lines[i].trim() === '') i++;
  while (i < lines.length && /^>/.test(lines[i])) i++;
  return lines.slice(i);
}

// Footer = a trailing `<p class="lesson-md-nav">…</p>` line (plus trailing blanks).
function stripFooter(lines) {
  let j = lines.length - 1;
  while (j >= 0 && lines[j].trim() === '') j--;
  if (j < 0 || !new RegExp(`^<p class="${NAV_CLASS}">`).test(lines[j])) return lines;
  return lines.slice(0, j);
}

function transform(raw, title, summary, prev, next) {
  // Preserve the file's original EOL, but do ALL work in LF so a CRLF file's
  // frontmatter doesn't get its `\r\n` doubled to `\r\r\n` by the final convert.
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const norm = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const fmMatch = norm.match(/^(---\n[\s\S]*?\n---)\n?([\s\S]*)$/);
  if (!fmMatch) throw new Error('no frontmatter block found');
  const frontmatter = fmMatch[1];
  const body = fmMatch[2] ?? '';

  let lines = body.split('\n');
  lines = stripHeader(lines);
  lines = stripFooter(lines);
  const core = lines.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');

  const header = buildHeader(title, summary);
  const footer = buildFooter(prev, next);
  const newBody = `${header}\n\n${core}\n\n${footer}\n`;
  const out = `${frontmatter}\n\n${newBody}`;
  return eol === '\r\n' ? out.replace(/\n/g, '\r\n') : out;
}

// --- main -------------------------------------------------------------------
function main() {
  const lessons = allLessons()
    .filter((l) => l.status === 'complete' && l.slug)
    .sort((a, b) => cmpId(a.id, b.id));

  let changed = 0;
  const errors = [];

  for (let i = 0; i < lessons.length; i++) {
    const l = lessons[i];
    const prev = lessons[i - 1] ?? null;
    const next = lessons[i + 1] ?? null;
    const file = path.join(LESSON_DIR, `${l.slug}.md`);

    let raw;
    try {
      raw = readFileSync(file, 'utf8');
    } catch {
      errors.push(`missing file for ${l.id}: ${l.slug}.md`);
      continue;
    }

    const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const title = readField(block, 'title');
    const summary = readField(block, 'summary');
    if (!title || !summary) {
      errors.push(`${l.id}: missing title/summary in frontmatter`);
      continue;
    }

    const out = transform(raw, title, summary, prev, next);
    if (out !== raw) {
      writeFileSync(file, out, 'utf8');
      changed++;
    }
  }

  if (errors.length) {
    console.error(`sync-lesson-github-extras: ${errors.length} error(s):`);
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(
    `sync-lesson-github-extras: OK — ${lessons.length} lessons, ${changed} file(s) updated.`
  );
}

main();
