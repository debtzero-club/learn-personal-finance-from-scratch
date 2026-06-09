import { describe, it, expect, beforeEach, vi } from 'vitest';
// RED (Wave 0): ./progress does NOT exist yet — Plan 04 (PROG-01) extracts it from
// LessonLayout.astro. This pins the 'pfs:done' localStorage contract.
// Target API (see 01-01-PLAN <interfaces>):
//   read() -> string[] ; isDone(slug) -> boolean
//   markDone(slug) -> void ; unmark(slug) -> void ; toggle(slug) -> void
//   KEY = 'pfs:done' ; corrupt JSON falls back to [] (try/catch, never throws)
// We mock localStorage with vi.stubGlobal so we do NOT need jsdom (keeps deps minimal).
import { read, isDone, markDone, unmark, toggle } from './progress';

// Build a fresh in-memory localStorage mock before each test.
function installMockStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  });
  return store;
}

beforeEach(() => {
  installMockStorage();
});

describe('progress contract — pfs:done', () => {
  it('read() returns [] when storage is empty', () => {
    expect(read()).toEqual([]);
  });

  it('markDone then isDone is true and read() includes the slug', () => {
    markDone('a');
    expect(isDone('a')).toBe(true);
    expect(read()).toContain('a');
  });

  it('markDone twice does not duplicate', () => {
    markDone('a');
    markDone('a');
    expect(read()).toEqual(['a']);
    expect(read().length).toBe(1);
  });

  it('unmark removes the slug', () => {
    markDone('a');
    unmark('a');
    expect(isDone('a')).toBe(false);
    expect(read()).not.toContain('a');
  });

  it('toggle adds then removes', () => {
    toggle('b');
    expect(isDone('b')).toBe(true);
    toggle('b');
    expect(isDone('b')).toBe(false);
  });
});

describe('progress resilience — corrupt JSON fallback', () => {
  it('read() returns [] (no throw) when stored value is not valid JSON', () => {
    const store = new Map<string, string>([['pfs:done', 'not json']]);
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
    });
    expect(() => read()).not.toThrow();
    expect(read()).toEqual([]);
  });
});
