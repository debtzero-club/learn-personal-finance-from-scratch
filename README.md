# Learn Personal Finance from Scratch

**A free, open-source course that teaches you money from the ground up — built for your first paycheck, not your stock portfolio.**

The internet is full of investing content, but almost nobody teaches the everyday basics: how a
paycheck works, what a credit card actually does, how interest really works, how to dig out of debt.
This course fills that gap — in plain English, with no jargon and no shame.

- **Free forever. No signup, no paywall, no ads.** Progress is saved in your browser only.
- **US-focused**, for total beginners (especially first-job starters).
- **Open source** — anyone can improve it. See [CONTRIBUTING.md](CONTRIBUTING.md).
- **Educational only — not financial advice.**

Built and maintained by the team at [Toya](https://usetoya.com) and contributors.

---

## How it's organized

Two tracks, 14 phases, ~92 lessons. Every lesson runs the same short loop:
**the situation → the idea → by the numbers → do it → check yourself → keep this.**

- **Track 1 — Foundations:** how money works, paychecks & taxes, banking, budgeting, saving,
  interest & compounding, credit.
- **Track 2 — Real-Life Money:** debt & loans, student loans, workplace benefits, taxes deeper,
  insurance, big decisions, investing basics.

The full outline lives in [`src/data/curriculum.ts`](src/data/curriculum.ts).

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
```

Build the static site:

```bash
npm run build    # output in dist/
```

## Tech

[Astro](https://astro.build) static site. Lessons are Markdown in `src/content/lessons/`.
No backend, no database — it deploys as static files to Vercel / Netlify / Cloudflare Pages.

## Project docs

- **[CLAUDE.md](CLAUDE.md)** — the master operating doc (rules, architecture, how to add a lesson).
- **[docs/MASTER-PLAN.md](docs/MASTER-PLAN.md)** — the strategy and reasoning.
- **[docs/LESSON-TEMPLATE.md](docs/LESSON-TEMPLATE.md)** — copy this to write a new lesson.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how to help.

## License

Code: [MIT](LICENSE). Content (lessons, text): **CC BY-SA 4.0**.
