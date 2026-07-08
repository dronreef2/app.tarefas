# Todo App

A modern React TypeScript todo application built with Vite and styled with Tailwind CSS.

## Features

- Add, edit, and delete todo items
- Mark todos as complete/incomplete (click the circle, or click the label)
- Double-click a todo (or use the pencil icon) to edit inline — Enter saves, Esc cancels
- Empty a todo's text and save to delete it
- Filter todos by status (all / active / completed)
- Clear completed todos in one click
- Items persist in `localStorage` between page reloads
- Responsive design — works on phone, tablet, and desktop

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- ESLint 9 (flat config) + TypeScript ESLint
- Prettier 3 (wired through `eslint-config-prettier` to avoid rule conflicts)

## Project Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm, pnpm, or yarn

### Installation

```bash
cd todo-app
npm install
```

## Development

### Start Dev Server

```bash
npm run dev
```

App runs on http://localhost:5173

### Lint

```bash
npm run lint
```

### Format code

Auto-format everything in `src/`:

```bash
npm run format
```

Verify formatting without writing (CI-friendly):

```bash
npm run format:check
```

### Type-check

```bash
npx tsc -b --noEmit
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

Preview the production bundle locally:

```bash
npm run preview
```

## Available Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run lint` | Run ESLint across `*.ts` / `*.tsx` |
| `npm run format` | Format `src/**` with Prettier |
| `npm run format:check` | Verify Prettier formatting without writing |
| `npm run preview` | Serve the built `dist/` locally |

## Project Structure

```
todo-app/
├── .prettierrc.json          # Prettier rules
├── .prettierignore
├── eslint.config.js          # Flat ESLint config (Prettier-compatible)
├── index.html                # App shell
├── package.json
├── postcss.config.js         # Tailwind v4 PostCSS plugin
├── tailwind.config.js (intentionally absent — v4 is CSS-first)
├── tsconfig.json             # Solution file referencing app + node configs
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── components/
    │   └── TodoApp.tsx       # Main todo component (state, UI, persistence)
    ├── App.tsx               # Root wrapper
    ├── index.css             # Tailwind import + base styles
    └── main.tsx              # React entry point
```

## Notes

- State is held in React + `localStorage` (key: `todo-app:items`). Clear site
  data to reset the list.
- Tailwind v4 is used, which is configured entirely in CSS — there's no
  `tailwind.config.js` by design.
