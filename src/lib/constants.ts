export const APP_NAME = 'RWA Tokenization Framework'

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Assets', path: '/assets', icon: 'Building2' },
  { label: 'Investors', path: '/investors', icon: 'Users' },
  { label: 'Dividends', path: '/dividends', icon: 'Banknote' },
  { label: 'Compliance', path: '/compliance', icon: 'Shield' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
] as const

export const ASSET_CLASSES = [
  { value: 'real_estate', label: 'Real Estate', description: 'Tokenized property and real estate assets' },
  { value: 'treasury', label: 'Treasury', description: 'Government bonds and treasury bills' },
  { value: 'invoice', label: 'Invoice', description: 'Invoice factoring and trade finance' },
  { value: 'commodity', label: 'Commodity', description: 'Gold, silver, and other commodities' },
  { value: 'equity', label: 'Equity', description: 'Tokenized company shares and equity' },
  { value: 'other', label: 'Other', description: 'Other real-world assets' },
] as const

export const MOCK_METRICS = {
  totalAssets: 12,
  totalInvestors: 847,
  totalSupply: '125000000',
  totalDistributed: '3450000',
  activeProposals: 3,
  pendingKYC: 24,
  volume24h: '890000',
  uniqueHolders: 623,
}

export const MOCK_ASSETS: import('@/types').Asset[] = [
  {
    id: '1',
    name: 'Manhattan Prime Office',
    symbol: 'MPO-01',
    assetClass: 'real_estate',
    description: 'Tokenized commercial real estate in prime Manhattan location',
    totalSupply: '10000000',
    circulatingSupply: '7500000',
    price: '125.00',
    issuer: 'GCK3...8J9F',
    contractId: 'CCX7...4F2A',
    createdAt: '2025-01-15T10:00:00Z',
    status: 'active',
    compliance: {
      kycRequired: true,
      kycProvider: 'sep12',
      transferRestrictions: true,
      investorWhitelistRequired: true,
    },
    distribution: {
      totalDistributed: '450000',
      lastDistribution: '2025-06-01T00:00:00Z',
      nextDistribution: '2025-07-01T00:00:00Z',
      apr: '5.2',
    },
  },
  {
    id: '2',
    name: 'US Treasury Bill Fund',
    symbol: 'TBF-01',
    assetClass: 'treasury',
    description: 'Short-term US Treasury bill fund with daily liquidity',
    totalSupply: '50000000',
    circulatingSupply: '42000000',
    price: '1.00',
    issuer: 'GCK3...8J9F',
    contractId: 'CCX8...5B3C',
    createdAt: '2025-02-01T10:00:00Z',
    status: 'active',
    compliance: {
      kycRequired: true,
      kycProvider: 'sep12',
      transferRestrictions: false,
      investorWhitelistRequired: true,
    },
    distribution: {
      totalDistributed: '1800000',
      lastDistribution: '2025-06-01T00:00:00Z',
      nextDistribution: '2025-06-15T00:00:00Z',
      apr: '4.8',
    },
  },
  {
    id: '3',
    name: 'Global Commodities Pool',
    symbol: 'GCP-01',
    assetClass: 'commodity',
    description: 'Diversified commodity pool backed by gold and silver reserves',
    totalSupply: '25000000',
    circulatingSupply: '18000000',
    price: '245.50',
    issuer: 'GB7H...2K3M',
    contractId: 'CCD9...6C4D',
    createdAt: '2025-03-10T10:00:00Z',
    status: 'active',
    compliance: {
      kycRequired: true,
      kycProvider: 'custom',
      transferRestrictions: true,
      investorWhitelistRequired: true,
    },
    distribution: {
      totalDistributed: '620000',
      lastDistribution: '2025-05-15T00:00:00Z',
      nextDistribution: '2025-08-15T00:00:00Z',
      apr: '3.9',
    },
  },
  {
    id: '4',
    name: 'TechGrowth Equity Token',
    symbol: 'TGET-01',
    assetClass: 'equity',
    description: 'Tokenized equity in a diversified tech growth portfolio',
    totalSupply: '15000000',
    circulatingSupply: '9000000',
    price: '78.30',
    issuer: 'GB7H...2K3M',
    contractId: 'CCE0...7D5E',
    createdAt: '2025-04-20T10:00:00Z',
    status: 'active',
    compliance: {
      kycRequired: true,
      kycProvider: 'sep12',
      transferRestrictions: true,
      investorWhitelistRequired: true,
    },
    distribution: {
      totalDistributed: '280000',
      lastDistribution: '2025-05-30T00:00:00Z',
      nextDistribution: '2025-06-30T00:00:00Z',
      apr: '6.1',
    },
  },
  {
    id: '5',
    name: 'Invoice Finance Pool A',
    symbol: 'IFP-A',
    assetClass: 'invoice',
    description: 'Short-term invoice factoring pool for SME financing',
    totalSupply: '10000000',
    circulatingSupply: '5000000',
    price: '1.02',
    issuer: 'GCK3...8J9F',
    contractId: 'CCF1...8E6F',
    createdAt: '2025-05-01T10:00:00Z',
    status: 'active',
    compliance: {
      kycRequired: true,
      kycProvider: 'sep12',
      transferRestrictions: false,
      investorWhitelistRequired: false,
    },
    distribution: {
      totalDistributed: '300000',
      lastDistribution: '2025-06-01T00:00:00Z',
      nextDistribution: '2025-07-01T00:00:00Z',
      apr: '7.5',
    },
  },
  {
    id: '6',
    name: 'Green Bond Series 1',
    symbol: 'GBND-01',
    assetClass: 'treasury',
    description: 'Sustainable green bond for renewable energy projects',
    totalSupply: '15000000',
    circulatingSupply: '12000000',
    price: '1.05',
    issuer: 'GB7H...2K3M',
    contractId: 'CCG2...9F7G',
    createdAt: '2025-05-15T10:00:00Z',
    status: 'active',
    compliance: {
      kycRequired: true,
      kycProvider: 'sep12',
      transferRestrictions: true,
      investorWhitelistRequired: true,
    },
    distribution: {
      totalDistributed: '180000',
      lastDistribution: '2025-05-31T00:00:00Z',
      nextDistribution: '2025-11-30T00:00:00Z',
      apr: '4.2',
    },
  },
]

export const MOCK_INVESTORS: import('@/types').Investor[] = [
  {
    id: '1', address: 'GA2X...8J9F', name: 'Alpha Ventures Ltd', email: 'alpha@example.com',
    kycStatus: 'approved', kycProvider: 'sep12', whitelisted: true,
    balance: '2500000', tokensHeld: 3, joinedAt: '2025-01-20T10:00:00Z', lastActivity: '2025-06-10T14:00:00Z',
  },
  {
    id: '2', address: 'GB7H...2K3M', name: 'Beta Capital Partners', email: 'beta@example.com',
    kycStatus: 'approved', kycProvider: 'sep12', whitelisted: true,
    balance: '1800000', tokensHeld: 2, joinedAt: '2025-02-15T10:00:00Z', lastActivity: '2025-06-09T09:00:00Z',
  },
  {
    id: '3', address: 'GC3K...4M5N', name: 'Gamma Treasury LLC', email: 'gamma@example.com',
    kycStatus: 'pending', kycProvider: 'sep12', whitelisted: false,
    balance: '0', tokensHeld: 0, joinedAt: '2025-05-20T10:00:00Z', lastActivity: '2025-06-01T11:00:00Z',
  },
  {
    id: '4', address: 'GD4L...5N6P', name: 'Delta Real Estate Trust', email: 'delta@example.com',
    kycStatus: 'approved', kycProvider: 'custom', whitelisted: true,
    balance: '5200000', tokensHeld: 4, joinedAt: '2025-01-10T10:00:00Z', lastActivity: '2025-06-10T16:00:00Z',
  },
  {
    id: '5', address: 'GE5M...6P7Q', name: 'Epsilon Fund Management', email: 'epsilon@example.com',
    kycStatus: 'rejected', kycProvider: 'sep12', whitelisted: false,
    balance: '0', tokensHeld: 0, joinedAt: '2025-04-05T10:00:00Z', lastActivity: '2025-04-06T08:00:00Z',
  },
  {
    id: '6', address: 'GF6N...7Q8R', name: 'Zeta Holdings Inc', email: 'zeta@example.com',
    kycStatus: 'approved', kycProvider: 'sep12', whitelisted: true,
    balance: '890000', tokensHeld: 1, joinedAt: '2025-03-01T10:00:00Z', lastActivity: '2025-06-08T12:00:00Z',
  },
  {
    id: '7', address: 'GG7P...8R9S', name: 'Eta Corporate Treasury', email: 'eta@example.com',
    kycStatus: 'pending', kycProvider: 'sep12', whitelisted: false,
    balance: '0', tokensHeld: 0, joinedAt: '2025-06-01T10:00:00Z', lastActivity: '2025-06-01T10:00:00Z',
  },
  {
    id: '8', address: 'GH8Q...9S0T', name: 'Theta Investment Group', email: 'theta@example.com',
    kycStatus: 'approved', kycProvider: 'custom', whitelisted: true,
    balance: '3100000', tokensHeld: 3, joinedAt: '2025-02-01T10:00:00Z', lastActivity: '2025-06-10T10:00:00Z',
  },
]

export const MOCK_DIVIDENDS: import('@/types').DividendDistribution[] = [
  { id: '1', assetId: '1', assetName: 'Manhattan Prime Office', amount: '125000', perShare: '0.0125', date: '2025-06-01T00:00:00Z', status: 'completed', recipientsCount: 45, totalAmount: '125000' },
  { id: '2', assetId: '2', assetName: 'US Treasury Bill Fund', amount: '450000', perShare: '0.009', date: '2025-06-01T00:00:00Z', status: 'completed', recipientsCount: 128, totalAmount: '450000' },
  { id: '3', assetId: '4', assetName: 'TechGrowth Equity Token', amount: '75000', perShare: '0.005', date: '2025-05-30T00:00:00Z', status: 'completed', recipientsCount: 82, totalAmount: '75000' },
  { id: '4', assetId: '5', assetName: 'Invoice Finance Pool A', amount: '95000', perShare: '0.0095', date: '2025-06-01T00:00:00Z', status: 'completed', recipientsCount: 35, totalAmount: '95000' },
  { id: '5', assetId: '1', assetName: 'Manhattan Prime Office', amount: '125000', perShare: '0.0125', date: '2025-07-01T00:00:00Z', status: 'pending', recipientsCount: 47, totalAmount: '125000' },
  { id: '6', assetId: '3', assetName: 'Global Commodities Pool', amount: '155000', perShare: '0.0062', date: '2025-08-15T00:00:00Z', status: 'pending', recipientsCount: 64, totalAmount: '155000' },
]

export const MOCK_COMPLIANCE_RULES: import('@/types').ComplianceRule[] = [
  { id: '1', name: 'KYC Verification', type: 'kyc', enabled: true, description: 'All investors must complete KYC before investing', config: { minLevel: 2 } },
  { id: '2', name: 'Transfer Limit', type: 'transfer_limit', enabled: true, description: 'Maximum transfer amount per transaction', config: { maxAmount: '1000000' } },
  { id: '3', name: 'Investor Tier', type: 'investor_tier', enabled: true, description: 'Accredited investor verification required', config: { requiredTier: 'accredited' } },
  { id: '4', name: 'Jurisdiction Filter', type: 'jurisdiction', enabled: false, description: 'Restrict investors by jurisdiction', config: { allowedCountries: ['US', 'UK', 'EU'] } },
]

export const MOCK_TRANSFER_RESTRICTIONS: import('@/types').TransferRestriction = {
  id: '1',
  name: 'Default Transfer Policy',
  description: 'Standard transfer restrictions for regulated tokens',
  enabled: true,
  rules: {
    maxTransferAmount: '500000',
    minHoldingPeriod: 30,
    approvedJurisdictions: ['US', 'UK', 'DE', 'FR', 'SG', 'AE', 'JP'],
    requireKYC: true,
  },
}
