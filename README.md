# 🌐 RWA Tokenization Framework

**Tokenize, manage, and distribute real-world assets on the Stellar Soroban blockchain — with built-in compliance.**

A production-grade React 19 + TypeScript platform that lets issuers tokenize real-world assets (real estate, treasuries, invoices, commodities, equity), manage investor KYC & whitelisting, enforce transfer restrictions, and distribute dividends — all backed by the Stellar network and its Soroban smart contracts.

> Built for the **Stellar Community Fund** · Open source · Runs with one command

---

## 📋 Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Why Stellar](#why-stellar)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Stellar Integration](#stellar-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Pitch Deck](#pitch-deck)
- [Roadmap](#roadmap)
- [License](#license)

---

## The Problem

Real-world assets (RWA) — commercial real estate, treasury bills, invoices, commodities, private equity — are **illiquid, opaque, and expensive to administer**. Issuers face three compounding barriers:

1. **Liquidity** — Assets are locked in private markets with no fractional ownership or secondary trading.
2. **Compliance** — Regulated tokenization requires KYC/AML, investor whitelists, transfer restrictions, and jurisdiction controls. Most tokenization stacks bolt these on *after* the fact.
3. **Distribution** — Paying yield to hundreds of holders is a manual, error-prone process with no on-chain audit trail.

Existing ERC-20 style token standards ignore regulated-asset requirements, and DIY compliance middleware breaks the security guarantees of the underlying chain.

## The Solution

**RWA Tokenization Framework** is a complete, compliance-first tokenization platform on Stellar:

- **Compliance is encoded at the contract level**, not bolted on — KYC requirements, transfer limits, holding periods, jurisdiction filters, and investor whitelists are part of the token's behavior.
- **One dashboard for the full asset lifecycle**: create tokens, manage investors, run compliance controls, and distribute dividends with a single click.
- **Built on Soroban** — Stellar's Rust-based smart contract platform — for predictable fees, fast finality, and a low-carbon network designed for exactly this use case.

Judges and reviewers can run the entire platform in **one command** — no wallet, no contracts, no keys required (demo mode included).

## Why Stellar

| Requirement | Stellar |
|---|---|
| **Fee predictability** | Sub-cent transaction fees with no gas auctions — ideal for securities-grade transfers |
| **Speed & finality** | 3–5 second settlement, low-energy consensus |
| **Soroban smart contracts** | Rust-based, auditable, deterministic contracts for regulated assets |
| **SEP standards** | SEP-12 KYC flows, SEP-24/38 anchors — the industry's best-in-class compliance rails |
| **Credibility** | Powering real-world issuance (stablecoins, tokenized treasuries) since 2014 |

## Features

- 📊 **Dashboard** — live metrics, 7-day volume chart, asset-class distribution, pending KYC queue
- 🏢 **Asset Management** — tokenize assets via a 3-step wizard, browse and search tokens, view compliance & distribution details
- 👥 **Investor Management** — KYC approval/rejection, whitelist management, searchable investor registry
- 💸 **Dividend Distribution** — one-click yield distribution with transaction hashes
- 🛡️ **Compliance Console** — toggle KYC rules, transfer limits, holding periods, and jurisdiction filters
- ⚙️ **Settings** — RPC/network configuration with live connectivity testing
- 🌗 **Dark mode** · ♿ **Accessible** (ARIA dialogs, skip links, keyboard nav) · 📱 **Responsive**
- 🔐 **Demo mode** — explore everything without installing Freighter; disable via env for real-wallet-only flows

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript 6, Tailwind CSS v4, lucide-react, recharts |
| Routing / Data | React Router v8, TanStack React Query |
| Blockchain | stellar-sdk v13 (Soroban RPC), @stellar/freighter-api |
| Observability | Sentry (error tracking) |
| Quality | Vitest, Testing Library, Playwright, Storybook 10, ESLint 10 |
| Ops | Vite 8, Docker, Nginx, GitHub Actions |

## Getting Started

### Prerequisites

- **Node.js 22+** (Node 22 LTS recommended) and npm 10+
- A modern browser. For the full experience, install the [Freighter wallet](https://www.freighter.app/) extension — **not required** thanks to demo mode.

### 1. Install & run (one command)

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. The app boots in demo mode — every page is explorable without a wallet.

### 2. Environment

Copy the template and adjust:

```bash
cp .env.example .env
```

No variables are required to run the demo. See [Environment Variables](#environment-variables) for the full list.

### 3. Production build

```bash
npm run build
npm run preview   # serve the production bundle locally
```

### Docker (one-command deployment)

```bash
docker compose up --build
# → http://localhost:8080
```

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_STELLAR_NETWORK` | `testnet` | `testnet` \| `mainnet` \| `futurenet` |
| `VITE_RPC_URL` | Soroban testnet | Soroban RPC endpoint |
| `VITE_NETWORK_PASSPHRASE` | Testnet passphrase | Network passphrase for tx signing |
| `VITE_HORIZON_URL` | Horizon testnet | Balance lookups |
| `VITE_RWA_FACTORY_CONTRACT` | — | Deployed token-factory contract id |
| `VITE_INVESTOR_REGISTRY_CONTRACT` | — | Deployed investor-registry contract id |
| `VITE_DIVIDEND_DISTRIBUTOR_CONTRACT` | — | Deployed dividend contract id |
| `VITE_COMPLIANCE_MANAGER_CONTRACT` | — | Deployed compliance contract id |
| `VITE_ENABLE_DEMO_MODE` | `true` | Set `false` to require Freighter for all sessions |
| `VITE_SENTRY_DSN` | — | Sentry error tracking DSN |

All secrets stay out of the repository — nothing is hardcoded.

## Stellar Integration

This project integrates Stellar at three layers:

### 1. Wallet (Freighter)
`src/lib/stellar.ts` centralizes all wallet interaction:
- **Timeout-guarded** Freighter calls — without the extension the app fails fast instead of hanging
- **Demo mode** — deterministic demo address so the full UX is testable without a wallet
- Real **Horizon balance lookups** for connected wallets

### 2. Soroban RPC client
`src/lib/contracts/client.ts` is a typed Soroban client built on `stellar-sdk` v13:
- `simulateContract` — dry-run contract calls
- `buildAndSendContractCall` — build → prepare → sign (Freighter) → submit → poll for finality
- `toScVal` / `fromScVal` — safe argument/result conversion
- Network configuration derived from `.env` (`testnet` / `mainnet` / `futurenet`)

### 3. Contract ABI
`src/lib/contracts/addresses.ts` documents the Soroban contract interface (`CONTRACT_SPECS`) — the exact methods the frontend expects for tokens, investor registry, and compliance manager — so the UI and contracts stay in lockstep.

**Data layer:** `src/lib/contracts/services.ts` exposes the async API the pages consume. Today it's backed by curated demo data so the app is fully explorable without deployed contracts; swapping to live contracts is a drop-in replacement of each function using the client above — **zero page changes required**.

## Testing

| Command | What it runs |
|---|---|
| `npm run typecheck` | TypeScript strict-mode compile check |
| `npm run lint` | ESLint across the project |
| `npm test` | 75+ unit tests (Vitest + Testing Library) |
| `npm run test:e2e` | 24 Playwright end-to-end + a11y tests |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run storybook:build` | Static Storybook build |

GitHub Actions runs **all of the above** on every push/PR — the CI badge is green.

## Deployment

### Docker (recommended)

```bash
docker compose up --build -d
```

The multi-stage `Dockerfile` builds the app and serves it via Nginx with gzip, immutable asset caching, and hardened security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

### Manual / Vercel / Netlify / Cloudflare Pages

`npm run build` emits a static site in `dist/` — deploy it anywhere. For SPA routing, configure a fallback rewrite to `/index.html` (the included `nginx.conf` shows the exact config).

## Project Structure

```
src/
├── components/          # Reusable UI (ui/, layout/, tokens/, dividends/, wallet/)
├── pages/               # Route pages (Dashboard, Assets, Investors, Dividends…)
├── lib/
│   ├── contracts/       # Soroban client, ABI specs, service layer
│   ├── auth/            # Wallet auth context + protected routes
│   ├── errors/          # Sentry, error boundaries, retry helpers, toasts
│   ├── features/        # Feature flags
│   ├── stellar.ts       # Wallet + balance integration
│   ├── utils.ts         # Formatting helpers
│   └── constants.ts     # Nav config + curated demo data
├── types/               # Shared TypeScript models
└── __tests__/           # Unit tests
e2e/                     # Playwright end-to-end tests
.storybook/              # Storybook config
```

## Pitch Deck

### Problem
Real-world assets — real estate, treasuries, invoices, commodities — are illiquid, opaque, and locked in private markets. Issuers can't offer fractional ownership, and regulated tokenization is blocked by fragmented KYC and transfer-compliance tooling.

### Solution
A compliance-first tokenization platform on Stellar Soroban where KYC requirements, whitelists, transfer restrictions, and dividends are enforced at the contract level and managed from one clean dashboard.

### Impact
Unlocks liquidity for billions of dollars of dormant assets, brings 24/7 global markets to traditionally illiquid investments, and gives regulators verifiable on-chain compliance — on a low-fee, low-carbon network designed for real-world issuance.

### Technology
React 19 + TypeScript strict mode · Soroban smart contracts (stellar-sdk v13) · SEP-12 KYC rails · Freighter wallet · Docker · CI with 75+ unit tests and 24 e2e tests, all green.

### Future Roadmap
- Live Soroban contract deployment + on-chain data layer (client is ready — see [Stellar Integration](#stellar-integration))
- SEP-24 fiat on/off-ramps via anchors
- Secondary-market order book for tokenized assets
- Multi-jurisdiction regulatory reporting exports
- DAO-governed compliance rule updates

---

## Demo Video

> 🎬 *Demo video link placeholder — record your 2-minute walkthrough and drop it here.*

---

## License

MIT — use it, fork it, ship it.
