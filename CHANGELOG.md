# Changelog

All notable changes to **app.tarefas** are recorded here. This file is
maintained by [release-please](https://github.com/googleapis/release-please)
based on [Conventional Commits](https://www.conventionalcommits.org/).

## 1.0.0 (2026-07-13)


### Features

* Kanban board with dnd-kit + shadcn-style UI + tests + CI/CD ([82f05d9](https://github.com/dronreef2/app.tarefas/commit/82f05d9a17bc2ed5def3b83600fae706775cdf9b))
* **todos:** add TodoApp with CRUD, filters, and localStorage persistence ([ec2c3a5](https://github.com/dronreef2/app.tarefas/commit/ec2c3a59eb06686e306a0e6bfaa23e17b84010c9))


### Bug Fixes

* **ci:** add @types/node so vite.config.ts compiles in CI ([dba5813](https://github.com/dronreef2/app.tarefas/commit/dba581379d23eb257058694bd8333581a3442584))

## [Unreleased]

### ✨ Features

- Kanban board with 3 columns and drag-and-drop between/within columns
- Fractional-indexing for stable, O(1) reordering
- shadcn-style UI primitives (Button, Card, Dialog, Input, Textarea, Badge)
- Light + dark mode tokens (auto via `prefers-color-scheme`)
- LocalStorage persistence (`todo-app:items:v2`)
- Vitest + Testing Library setup; 16 unit/integration tests
- GitHub Actions: CI (lint+type+test+build), deploy to Pages, release-please, CodeQL
- Dependabot for npm + GitHub Actions

### 🐛 Bug Fixes

- LocalStorage key bump from `todo-app:items` → `todo-app:items:v2` to align
  with the new schema (`status: 'todo' | 'doing' | 'done'` + `position` field).
- Vite/Vitest type conflict resolved by splitting `vite.config.ts` and
  `vitest.config.ts` (with `mergeConfig`).
- React Fast Refresh warnings fixed by extracting `buttonVariants` and
  `badgeVariants` to dedicated files.

### 👷 CI/CD

- New `ci.yml` runs format-check, lint, type-check, test, and build on every PR.
- `release-please` configured for SemVer + auto-generated changelog.
- CodeQL weekly + on PR for TypeScript security scanning.
- Dependabot groups patch+minor npm updates to reduce PR noise.

### 📚 Documentation

- `docs/ARCHITECTURE.md` updated to reflect Better Auth (replaces deprecated Lucia)
  and dnd-kit for the kanban.
- `docs/curadoria/` — full 4-report curadoria (frontend, backend, quality, sintese).
- New top-level `CHANGELOG.md` (this file).

### ♻️ Code Refactoring

- `src/lib/storage.ts` — typed `Todo` schema, schema-versioned storage key,
  generator with collision resistance (`Date.now() + random`).
- `src/lib/order.ts` — typed wrapper around `fractional-indexing`.
- `src/hooks/useTodos.ts` — pure data hook; all UI lives in components.
- `src/components/ui/button.tsx` / `badge.tsx` — composed from
  `*-variants.ts` files to keep React Fast Refresh happy.

## [0.1.0] — 2026-07-08

### ✨ Features

- Initial scaffolding (Vite 6 + React 19 + TypeScript + Tailwind v4).
- Todo list with all/active/completed filters.
- localStorage persistence.
- GitHub Pages deployment on push to `main`.

[Unreleased]: https://github.com/dronreef2/app.tarefas/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dronreef2/app.tarefas/releases/tag/v0.1.0
