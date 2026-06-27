# Contributing to RWA Tokenization Frontend

Thanks for helping improve the Real World Asset tokenization frontend. This guide covers local setup, project conventions, and the issue workflow used for Stellar Drips Wave tasks.

## Prerequisites

- Node.js 22
- npm, using the committed package-lock.json
- Freighter wallet for wallet-connected flows
- A Stellar testnet account when testing contract calls

## Quick start

```bash
npm install
npm run dev
```

The Vite dev server starts locally and serves the React app. Keep contract interaction work on testnet unless a maintainer explicitly asks otherwise.

## Available scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run TypeScript build checks and create a production bundle |
| `npm run lint` | Run ESLint over the repo |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:coverage` | Run Vitest with coverage |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run storybook:build` | Build the static Storybook output |

## Project map

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Router, lazy page imports, auth wrappers, page loader |
| `src/pages/` | Route-level screens such as dashboard, assets, investors, and settings |
| `src/components/layout/` | Header, sidebar, and app shell |
| `src/components/ui/` | Reusable UI primitives and Storybook stories |
| `src/components/tokens/`, `src/components/compliance/`, `src/components/dividends/` | Domain-specific UI |
| `src/lib/contracts/` | Mock service facade, Soroban RPC helpers, and contract addresses |
| `src/lib/auth/` | Auth context and protected route guard |
| `src/__tests__/` | Vitest tests and setup |
| `e2e/` | Playwright smoke and accessibility tests |

## Adding a new page

1. Create a route component in `src/pages/`, for example `reports.tsx`.
2. Add a lazy import in `src/App.tsx` beside the existing page imports.
3. Add a `<Route>` under the shared `<Layout />`. Wrap protected pages with `ProtectedRoute` and the right role list.
4. Add the navigation item in `src/components/layout/sidebar.tsx` and map its Lucide icon in `iconMap`.
5. Add tests for important behavior in `src/__tests__/` and update Playwright coverage if it is a user-facing workflow.

## Adding a UI component

1. Put reusable primitives in `src/components/ui/` and domain-specific components in the matching domain folder.
2. Use the local `cn` helper from `src/lib/utils` for conditional class names.
3. Keep props typed and export the component plus useful prop types.
4. Add a Storybook story when the component is a reusable UI primitive.
5. Add a Vitest test for rendering states, accessibility labels, or interaction behavior.

## Service layer and contract swapping

Pages should call functions from `src/lib/contracts/services.ts` instead of reading mock constants or contract clients directly. That file currently returns mock data through async functions so pages already use the same shape expected from real contracts.

When replacing mock behavior with live Soroban calls:

- keep function names and return types stable for pages;
- use `src/lib/contracts/client.ts` for RPC, simulation, signing, and transaction polling;
- read contract IDs from `src/lib/contracts/addresses.ts` and `VITE_*` environment variables;
- preserve testnet defaults until mainnet readiness is explicitly reviewed;
- add tests that cover success, failure, and loading states.

## Stellar Drips Wave issue workflow

Maintainers may use Stellar Drips Wave labels to communicate scope and point value.

- `Trivial` means a small documentation or configuration change, currently described as 100 points in this repo.
- Use complexity labels such as `complexity:low`, `complexity:medium`, or `complexity:high` when maintainers add them.
- Comment or wait for assignment only if the issue asks for it. Otherwise, check for active PRs before opening yours.
- Keep PRs focused on one issue and include `Closes #<issue-number>` in the PR body.
- Mention validation commands, or say why no build was required for documentation-only work.

## Pull request checklist

- Branch from `main` with an issue-numbered name, such as `feature/10-contributing-guide`.
- Keep changes scoped to the issue requirements.
- Run relevant checks before review. For docs-only changes, a local build is usually not required.
- Do not commit secrets, wallet seed phrases, private keys, or personal data.
- Use Freighter and Stellar testnet for wallet-connected manual testing.
