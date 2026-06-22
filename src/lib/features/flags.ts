const STORAGE_KEY = 'rwa_feature_flags'

export interface FeatureFlags {
  dividendDistribution: boolean
  investorWhitelisting: boolean
  transferRestrictions: boolean
  darkMode: boolean
  contractDeploy: boolean
  kycProviderCustom: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  dividendDistribution: true,
  investorWhitelisting: true,
  transferRestrictions: true,
  darkMode: true,
  contractDeploy: true,
  kycProviderCustom: false,
}

function getEnvOverrides(): Partial<FeatureFlags> {
  const overrides: Partial<FeatureFlags> = {}
  const prefix = 'VITE_FF_'
  for (const key of Object.keys(DEFAULT_FLAGS) as (keyof FeatureFlags)[]) {
    const envKey = `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`
    const val = import.meta.env[envKey]
    if (val === 'true') overrides[key] = true
    if (val === 'false') overrides[key] = false
  }
  return overrides
}

function loadStored(): Partial<FeatureFlags> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function computeFlags(): FeatureFlags {
  const stored = loadStored()
  const env = getEnvOverrides()
  return { ...DEFAULT_FLAGS, ...stored, ...env }
}

export function getFeatureFlags(): FeatureFlags {
  return computeFlags()
}

export function isFeatureEnabled(key: keyof FeatureFlags): boolean {
  return computeFlags()[key]
}

export function overrideFeatureFlag(key: keyof FeatureFlags, value: boolean) {
  const stored = loadStored()
  stored[key] = value
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function resetFeatureFlags() {
  localStorage.removeItem(STORAGE_KEY)
}
