// Single owner of the 'pfs:done' progress contract (PROG-01).
//
// Progress is saved in the browser only — no signup, no server.
// IMPORTANT: never touch `localStorage` at module top level — it is browser-only
// and any server-side evaluation would throw. All access lives inside the
// exported functions, each guarded by a try/catch empty-array fallback so a
// corrupt stored value degrades to "nothing completed" rather than crashing.
const KEY = 'pfs:done';

/** Read the list of completed lesson slugs. Returns [] on empty or corrupt storage. */
export const read = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

/** True if the given lesson slug has been marked done. */
export const isDone = (slug: string): boolean => read().includes(slug);

const write = (a: string[]): void => localStorage.setItem(KEY, JSON.stringify(a));

/** Mark a lesson done (no-op if already done — never duplicates). */
export const markDone = (slug: string): void => {
  const a = read();
  if (!a.includes(slug)) {
    a.push(slug);
    write(a);
  }
};

/** Remove a lesson from the done list (no-op if not present). */
export const unmark = (slug: string): void => write(read().filter((s) => s !== slug));

/** Flip a lesson's done state. */
export const toggle = (slug: string): void => (isDone(slug) ? unmark(slug) : markDone(slug));
