import type { Asset, Investor, DividendDistribution, ComplianceRule, TransferRestriction, DashboardMetrics } from '@/types'
import { MOCK_ASSETS, MOCK_INVESTORS, MOCK_DIVIDENDS, MOCK_COMPLIANCE_RULES, MOCK_TRANSFER_RESTRICTIONS, MOCK_METRICS } from '@/lib/constants'

type Role = 'issuer' | 'investor' | 'admin'

// In production, this reads from the actual Soroban contracts.
// For now, it wraps mock data in the real async API shape so
// swapping to live contracts requires zero page changes.

export function getUserRole(_walletAddress: string): Promise<Role> {
  return Promise.resolve('issuer')
}

export async function fetchAssets(_walletAddress?: string): Promise<Asset[]> {
  return MOCK_ASSETS
}

export async function fetchAssetById(id: string): Promise<Asset | undefined> {
  return MOCK_ASSETS.find((a) => a.id === id)
}

export async function fetchInvestors(_walletAddress?: string): Promise<Investor[]> {
  return MOCK_INVESTORS
}

export async function fetchInvestorById(id: string): Promise<Investor | undefined> {
  return MOCK_INVESTORS.find((i) => i.id === id)
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

export interface ContractCallResult {
  hash: string
  status: 'SUCCESS' | 'FAILED'
}

export async function createContractCall(_method: string, _args: unknown[], _contractId: string): Promise<ContractCallResult> {
  await delay(1500)
  return { hash: '0x' + Math.random().toString(36).slice(2), status: 'SUCCESS' }
}

export async function deployToken(_params: {
  name: string
  symbol: string
  assetClass: string
  totalSupply: string
  kycRequired: boolean
  whitelistRequired: boolean
  transferRestrictions: boolean
}): Promise<string> {
  await delay(2000)
  return 'CC' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function distributeDividend(
  _assetId: string,
  _amount: string,
  _perShare: string
): Promise<string> {
  await delay(1500)
  return 'tx_' + Math.random().toString(36).slice(2, 10)
}

export async function updateComplianceRule(
  _ruleId: string,
  _enabled: boolean
): Promise<void> {
  await delay(500)
}

export async function approveInvestorKyc(_investorId: string): Promise<void> {
  await delay(1000)
}

export async function rejectInvestorKyc(_investorId: string): Promise<void> {
  await delay(1000)
}

export async function toggleWhitelist(_investorId: string, _whitelisted: boolean): Promise<void> {
  await delay(800)
}

export interface AppSettings {
  issuerName: string
  rpcUrl: string
  networkPassphrase: string
  kycProvider: string
  kycEndpoint: string
  defaultApr: string
  notificationEmail: string
}

export async function saveSettings(_settings: AppSettings): Promise<void> {
  await delay(1000)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
