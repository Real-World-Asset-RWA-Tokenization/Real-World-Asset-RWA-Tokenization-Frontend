import type { Asset, Investor, DividendDistribution, ComplianceRule, TransferRestriction, DashboardMetrics } from '@/types'
import { MOCK_ASSETS, MOCK_INVESTORS, MOCK_DIVIDENDS, MOCK_COMPLIANCE_RULES, MOCK_TRANSFER_RESTRICTIONS, MOCK_METRICS } from '@/lib/constants'

export type Role = 'issuer' | 'investor' | 'admin'

/**
 * Data access layer for the RWA contracts.
 *
 * This module exposes the exact async API the pages consume. Today it is
 * backed by curated demo data so the application is fully explorable without
 * deployed contracts. To go live, replace each implementation with a call to
 * `src/lib/contracts/client.ts` (Soroban RPC) using the method signatures in
 * `src/lib/contracts/addresses.ts` — the pages do not need to change.
 */

/** Simulated network latency so loading states and spinners are exercised. */
function simulateLatency(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Deterministic-looking identifier shaped like a Soroban transaction hash. */
function fakeTxHash(): string {
  const hex = () => Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  return `${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}`
}

export function getUserRole(_walletAddress: string): Promise<Role> {
  return Promise.resolve('issuer')
}

export async function fetchAssets(_walletAddress?: string): Promise<Asset[]> {
  return MOCK_ASSETS
}

export async function fetchAssetById(id: string): Promise<Asset | undefined> {
  return MOCK_ASSETS.find((asset) => asset.id === id)
}

export async function fetchInvestors(_walletAddress?: string): Promise<Investor[]> {
  return MOCK_INVESTORS
}

export async function fetchInvestorById(id: string): Promise<Investor | undefined> {
  return MOCK_INVESTORS.find((investor) => investor.id === id)
}

export async function fetchDividends(_walletAddress?: string): Promise<DividendDistribution[]> {
  return MOCK_DIVIDENDS
}

export async function fetchComplianceRules(_walletAddress?: string): Promise<ComplianceRule[]> {
  return MOCK_COMPLIANCE_RULES
}

export async function fetchTransferRestrictions(): Promise<TransferRestriction> {
  return MOCK_TRANSFER_RESTRICTIONS
}

export async function fetchDashboardMetrics(_walletAddress?: string): Promise<DashboardMetrics> {
  return MOCK_METRICS
}

export interface DeployTokenParams {
  name: string
  symbol: string
  assetClass: string
  totalSupply: string
  kycRequired: boolean
  whitelistRequired: boolean
  transferRestrictions: boolean
}

/**
 * Deploys a new RWA token contract. Validates inputs up front so invalid
 * requests fail fast with a clear message instead of burning a transaction.
 */
export async function deployToken(params: DeployTokenParams): Promise<string> {
  if (!params.name.trim()) throw new Error('Token name is required')
  if (!params.symbol.trim()) throw new Error('Token symbol is required')
  if (!params.assetClass) throw new Error('Asset class is required')
  const supply = Number(params.totalSupply)
  if (!Number.isFinite(supply) || supply <= 0) {
    throw new Error('Total supply must be a positive number')
  }

  await simulateLatency(2000)
  // In production this returns the deployed contract id from the Soroban factory.
  return `CC${Math.random().toString(36).slice(2, 10).toUpperCase()}`
}

/** Distributes a dividend for an asset and returns the transaction hash. */
export async function distributeDividend(
  assetId: string,
  amount: string,
  perShare: string,
): Promise<string> {
  if (!assetId) throw new Error('Asset is required')
  const total = Number(amount)
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error('Distribution amount must be a positive number')
  }
  if (!Number.isFinite(Number(perShare)) || Number(perShare) <= 0) {
    throw new Error('Amount per share must be a positive number')
  }

  await simulateLatency(1500)
  return fakeTxHash()
}

/** Enables or disables a compliance rule on-chain. */
export async function updateComplianceRule(
  _ruleId: string,
  _enabled: boolean,
): Promise<void> {
  await simulateLatency(500)
}

/** Approves an investor's KYC and whitelists them for transfers. */
export async function approveInvestorKyc(_investorId: string): Promise<void> {
  await simulateLatency(1000)
}

/** Rejects (or revokes) an investor's KYC verification. */
export async function rejectInvestorKyc(_investorId: string): Promise<void> {
  await simulateLatency(1000)
}

/** Adds or removes an investor from the transfer whitelist. */
export async function toggleWhitelist(_investorId: string, _whitelisted: boolean): Promise<void> {
  await simulateLatency(800)
}
