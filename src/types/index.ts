export type AssetClass = 'real_estate' | 'treasury' | 'invoice' | 'commodity' | 'equity' | 'other'

export type ComplianceStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type KYCProvider = 'sep12' | 'custom'

export interface Asset {
  id: string
  name: string
  symbol: string
  description: string
  assetClass: AssetClass
  totalSupply: string
  circulatingSupply: string
  price: string
  issuer: string
  contractId: string
  createdAt: string
  status: 'active' | 'paused' | 'closed'
  compliance: {
    kycRequired: boolean
    kycProvider: KYCProvider
    transferRestrictions: boolean
    investorWhitelistRequired: boolean
  }
  distribution: {
    totalDistributed: string
    lastDistribution: string
    nextDistribution: string
    apr: string
  }
}

export interface Investor {
  id: string
  address: string
  name: string
  email: string
  kycStatus: ComplianceStatus
  kycProvider: KYCProvider
  whitelisted: boolean
  balance: string
  tokensHeld: number
  joinedAt: string
  lastActivity: string
}

export interface DividendDistribution {
  id: string
  assetId: string
  assetName: string
  amount: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  recipientsCount: number
  totalAmount: string
  perShare: string
}

export interface ComplianceRule {
  id: string
  name: string
  type: 'kyc' | 'transfer_limit' | 'investor_tier' | 'jurisdiction' | 'custom'
  enabled: boolean
  description: string
  config: Record<string, unknown>
}

export interface TransferRestriction {
  id: string
  name: string
  description: string
  enabled: boolean
  rules: {
    maxTransferAmount: string
    minHoldingPeriod: number
    approvedJurisdictions: string[]
    requireKYC: boolean
  }
}

export interface DashboardMetrics {
  totalAssets: number
  totalInvestors: number
  totalSupply: string
  totalDistributed: string
  activeProposals: number
  pendingKYC: number
  volume24h: string
  uniqueHolders: number
}

export interface WalletInfo {
  connected: boolean
  address: string
  network: string
  balance: string
}

export interface NavItem {
  label: string
  path: string
  icon: string
  badge?: number
}
