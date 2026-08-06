import { describe, it, expect, beforeEach } from 'vitest'
import { getFeatureFlags, isFeatureEnabled, overrideFeatureFlag, resetFeatureFlags } from '@/lib/features/flags'

describe('feature flags', () => {
  beforeEach(() => {
    resetFeatureFlags()
  })

  it('returns sensible defaults', () => {
    const flags = getFeatureFlags()
    expect(flags.dividendDistribution).toBe(true)
    expect(flags.darkMode).toBe(true)
    expect(flags.contractDeploy).toBe(true)
    expect(flags.kycProviderCustom).toBe(false)
    expect(isFeatureEnabled('investorWhitelisting')).toBe(true)
  })

  it('persists overrides and resets to defaults', () => {
    overrideFeatureFlag('darkMode', false)
    expect(getFeatureFlags().darkMode).toBe(false)
    expect(isFeatureEnabled('darkMode')).toBe(false)

    resetFeatureFlags()
    expect(isFeatureEnabled('darkMode')).toBe(true)
  })
})
