# RWA Tokenization Frontend — AI Contributor Guide

## Project Overview

A React 19 + TypeScript 6 frontend for tokenizing Real-World Assets (RWAs) on the Stellar Soroban blockchain. Users create, manage, and trade tokenized assets, run compliance checks, and distribute dividends.

**Stack**: Vite 8 · Tailwind CSS v4 · React Router DOM v7 · TanStack React Query · Stellar SDK v13 · Freighter Wallet · Sentry · Vitest · Playwright · Storybook 10

## Repository Map

```
.github/workflows/ci.yml   — GitHub Actions: install + build on push/PR to main
.husky/pre-commit           — Runs `npm test` (Vitest unit tests)
.husky/pre-push             — Runs `npm run build`
src/
  main.tsx                  — App bootstrap (Sentry init)
  App.tsx                   — Providers (QueryClient, Theme, Toast, Router, Auth) + routes
  pages/                    — Lazy-loaded route pages (Dashboard, Assets, AssetDetail, Investors, InvestorDetail, Dividends, Compliance, Settings)
  components/               — Reusable UI (layout/, ui/, tokens/, dividends/, compliance/, theme/, wallet/)
  hooks/                    — Custom hooks (use-wallet)
  lib/
    auth/                   — AuthProvider (wallet connect, role-based access), ProtectedRoute
    contracts/              — Soroban contract addresses, client helpers, service layer
    transactions/           — Transaction queue with polling
    utils.ts                — cn(), formatCurrency(), shortenAddress(), etc.
    constants.ts            — NAV_ITEMS, ASSET_CLASSES, mock data
    features/flags.ts       — Feature flags
    errors/                 — Sentry, error boundaries, toast, retry helpers
  types/index.ts            — All TypeScript interfaces
  __tests__/                — Unit tests (Vitest + Testing Library)
e2e/                        — Playwright E2E + a11y tests
.storybook/                 — Storybook config + src/**/*.stories.tsx
```

## What To Push / Not Push

**DO commit**:
- Source code, tests, stories, config files

**DO NOT commit**:
- `node_modules/`, `dist/`, `storybook-static/`, `coverage/`, `playwright-report/`
- `.env` files, secrets, private keys
- IDE files (`.vscode/`, `.idea/`)

## How to Verify Task Completion

```bash
npm run typecheck    # TypeScript compilation check (tsc -b --noEmit)
npm run lint         # ESLint across the project
npm run test         # Vitest unit tests
npm run build        # TypeScript check + Vite production build
npm run test:e2e     # Playwright E2E tests (requires dev server)
npm run storybook:build  # Storybook static build
```

For most changes, `npm run build` is the primary verification — it runs both the type checker and the bundler. The Husky pre-push hook runs `npm run build` automatically before allowing a push.

**Testing note**: Unit tests use Vitest with `jsdom`. E2E tests use Playwright with Chromium. Stories use Storybook 10 with React Vite framework.

## CI / Git Hooks

- **CI**: Single `build` job in `.github/workflows/ci.yml` — `npm install && npm run build` on push/PR to `main`
- **Pre-commit**: `npm test` (unit tests via Husky)
- **Pre-push**: `npm run build` (type-check + production build via Husky)
