# app.tarefas

A modern task-management app — **Kanban board with drag-and-drop**, built with
React 19 + TypeScript + Vite 6, styled with Tailwind CSS v4, and
**deployed to GitHub Pages** on every push to `main`.

> **pt-BR first.** The interface is in Brazilian Portuguese; i18n-ready
> via the structure already in place.

---

## ✨ Features

- **3-column Kanban** (A Fazer · Em Andamento · Concluídas) with **drag-and-drop**
  between columns and within a column.
- **Reorder O(1)** via [fractional indexing](https://github.com/rocicorp/fractional-indexing)
  (same approach as Figma and Linear — no in-place re-numbering).
- **Keyboard accessible** — drag with pointer, tab through cards, focus ring on
  all interactive elements.
- **Persist locally** in `localStorage` (key: `todo-app:items:v2`).
- **Clear completed** in one click; per-column counts in the header.
- **Empty-state copy** per column.
- **Light + dark** design tokens (auto via `prefers-color-scheme`).

## 🧱 Tech stack

| Layer | Choice | Why |
|------|--------|-----|
| Framework | **React 19** | Latest stable; automatic JSX runtime; transitions / actions ready. |
| Build | **Vite 6** | Sub-second HMR; native ESM. |
| Type system | **TypeScript** (strict) | TS end-to-end. |
| Styling | **Tailwind CSS v4** + CSS variables | CSS-first config; semantic tokens. |
| UI primitives | **Radix UI** + shadcn-style components (copy-paste) | A11y out of the box; we own the code. |
| Drag-and-drop | **@dnd-kit** | 2.8M weekly downloads, used by Linear/Vercel, TS-first. |
| Reordering | **fractional-indexing** | O(1) moves. |
| Icons | **Lucide React** | Tree-shakable, consistent with shadcn. |
| Tests | **Vitest** + **Testing Library** + **happy-dom** | 10× faster than Jest; first-class TS. |
| E2E (planned) | **Playwright** | Multi-browser. |
| Lint/format | **ESLint 9** (flat config) + **Prettier 3** | Type-aware lint; consistent style. |
| CI | **GitHub Actions** | lint + type-check + test on every PR. |
| Releases | **release-please** | Conventional Commits → SemVer + changelog. |
| Deploy | **GitHub Pages** (Actions) | Zero infra; free. |

## 📂 Project structure

```
todo-app/
├── .github/
│   ├── workflows/         # ci, deploy-web, release-please, codeql
│   ├── dependabot.yml
│   └── ISSUE_TEMPLATE/
├── docs/
│   ├── ARCHITECTURE.md    # architectural decisions, data model, roadmap
│   ├── BACKLOG.md         # 12 issues ready for GitHub
│   ├── CURATION.md        # frontend-focused resource curation
│   └── curadoria/         # full curadoria (frontend, backend, quality, sintese)
├── public/                # static assets
├── src/
│   ├── components/
│   │   ├── ui/            # shadcn-style primitives (Button, Card, Dialog, ...)
│   │   ├── kanban/        # Board, Column, TaskCard, NewTaskDialog
│   │   └── TodoApp.tsx    # main entry
│   ├── hooks/
│   │   └── useTodos.ts    # state + persistence
│   ├── lib/
│   │   ├── utils.ts       # cn() helper (clsx + tailwind-merge)
│   │   ├── order.ts       # fractional indexing helpers
│   │   └── storage.ts     # localStorage + types
│   ├── test/
│   │   └── setup.ts       # vitest setup (jest-dom)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css          # Tailwind v4 import + design tokens
│   └── vite-env.d.ts
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── release-please-config.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

## 🚀 Getting started

### Prerequisites

- **Node.js 22+** (the CI uses 22; older versions untested).
- **npm 10+** (or pnpm/yarn if you prefer — `pnpm` is what the docs reference).

### Install

```bash
cd todo-app
npm install
```

### Development

```bash
npm run dev          # http://localhost:5173
```

### Test

```bash
npm test             # run once
npm run test:watch   # watch mode
npm run test:ui      # Vitest UI
```

### Lint & format

```bash
npm run lint
npm run format
npm run format:check
```

### Build

```bash
npm run build        # type-check + bundle to dist/
npm run preview      # preview the production build locally
```

## 🤖 CI/CD

| Workflow | Trigger | What it does |
|---------|---------|--------------|
| `ci.yml` | PR + push to `main` | format-check · lint · type-check · test · build |
| `deploy-web.yml` | push to `main` | builds `dist/` and deploys to GitHub Pages |
| `release-please.yml` | push to `main` | opens/updates a release PR; bumps SemVer; tags |
| `codeql.yml` | weekly + PR | security scan (TypeScript) |
| **Dependabot** | weekly | npm + GitHub Actions updates, grouped by semver |

To get releases flowing:

1. Start using [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `chore:`, etc.).
2. `release-please` will open a "chore: release vX.Y.Z" PR; merging it
   tags the release and creates a GitHub release.

## 🗺️ Roadmap

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) § 10 and
[`docs/BACKLOG.md`](./docs/BACKLOG.md) for the full plan.

- **MVP (frontend only, current state):**  Kanban, persistence, a11y, deploy to Pages.
- **V1 (next 6 weeks):**  backend (Hono + tRPC + Drizzle + Better Auth + Neon),
  i18n, recurrence, labels, comments, activity feed, notifications.
- **V2 (post):**  real-time, mobile/PWA, integrations, AI.

## 📚 Documentation

| File | Purpose |
|------|---------|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Tech decisions, data model, roadmap |
| [`docs/BACKLOG.md`](./docs/BACKLOG.md) | 12 ready-to-create GitHub issues |
| [`docs/CURATION.md`](./docs/CURATION.md) | Resource curation, frontend-focused |
| [`docs/curadoria/`](./docs/curadoria/) | Full curadoria (frontend + backend + quality + sintese) |

## 🛡️ Security

- **No secrets** in this repo. All API keys live in **GitHub Secrets** (Settings → Secrets).
- **Pinned Dependabot** keeps dependencies fresh against known CVEs.
- **CodeQL** runs weekly for static analysis.

If you find a vulnerability, please open a private advisory via
**Security → Advisories** on GitHub.

## 📄 License

MIT (or whatever you pick — adjust before going public).

---

> **Status:** MVP frontend shipped. Backend kickoff pending. See `docs/BACKLOG.md` for the
> first 12 issues to open on GitHub.
