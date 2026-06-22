export const CONTRACT_ADDRESSES = {
  rwaTokenFactory: import.meta.env.VITE_RWA_FACTORY_CONTRACT ?? '',
  investorRegistry: import.meta.env.VITE_INVESTOR_REGISTRY_CONTRACT ?? '',
  dividendDistributor: import.meta.env.VITE_DIVIDEND_DISTRIBUTOR_CONTRACT ?? '',
  complianceManager: import.meta.env.VITE_COMPLIANCE_MANAGER_CONTRACT ?? '',
} as const

export const CONTRACT_SPECS = {
  rwaToken: {
    methods: {
      name: { params: [], returns: 'string' },
      symbol: { params: [], returns: 'string' },
      balance: { params: ['address'], returns: 'i128' },
      totalSupply: { params: [], returns: 'i128' },
      decimals: { params: [], returns: 'u32' },
      transfer: { params: ['address', 'address', 'i128'], returns: 'void' },
      mint: { params: ['address', 'i128'], returns: 'void' },
      burn: { params: ['address', 'i128'], returns: 'void' },
      setKycRequired: { params: ['bool'], returns: 'void' },
      setTransferRestrictions: { params: ['bool'], returns: 'void' },
      setWhitelistRequired: { params: ['bool'], returns: 'void' },
      whitelistInvestor: { params: ['address'], returns: 'void' },
      removeWhitelistInvestor: { params: ['address'], returns: 'void' },
      isWhitelisted: { params: ['address'], returns: 'bool' },
      pause: { params: [], returns: 'void' },
      unpause: { params: [], returns: 'void' },
      getAssetClass: { params: [], returns: 'string' },
      getApr: { params: [], returns: 'i128' },
      distributeDividends: { params: ['i128', 'i128'], returns: 'void' },
    },
  },
  investorRegistry: {
    methods: {
      register: { params: ['address', 'string', 'string'], returns: 'void' },
      setKycStatus: { params: ['address', 'u32'], returns: 'void' },
      getKycStatus: { params: ['address'], returns: 'u32' },
      addToWhitelist: { params: ['address'], returns: 'void' },
      removeFromWhitelist: { params: ['address'], returns: 'void' },
      isWhitelisted: { params: ['address'], returns: 'bool' },
      getInvestorCount: { params: [], returns: 'u32' },
    },
  },
  complianceManager: {
    methods: {
      setRuleEnabled: { params: ['string', 'bool'], returns: 'void' },
      isRuleEnabled: { params: ['string'], returns: 'bool' },
      setMaxTransferAmount: { params: ['i128'], returns: 'void' },
      setMinHoldingPeriod: { params: ['u64'], returns: 'void' },
      addJurisdiction: { params: ['string'], returns: 'void' },
      removeJurisdiction: { params: ['string'], returns: 'void' },
      getApprovedJurisdictions: { params: [], returns: 'vec' },
      setKycProvider: { params: ['string'], returns: 'void' },
      getKycProvider: { params: [], returns: 'string' },
    },
  },
} as const

export const NETWORK_DEFAULTS = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
  },
  mainnet: {
    rpcUrl: 'https://soroban-mainnet.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
  },
  futurenet: {
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    networkPassphrase: 'Future Public Test Network ; October 2024',
  },
} as const
