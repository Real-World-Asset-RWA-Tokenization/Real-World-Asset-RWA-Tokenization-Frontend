import { describe, it, expect } from 'vitest'
import {
  checkWalletConnection,
  getWalletAddress,
  isDemoModeEnabled,
  DEMO_WALLET_ADDRESS,
} from '@/lib/stellar'

describe('stellar wallet helpers', () => {
  it('reports not connected when Freighter is unavailable', async () => {
    // jsdom has no window.freighter, so calls must fail fast — never hang.
    expect(await checkWalletConnection()).toBe(false)
    expect(await getWalletAddress()).toBeNull()
  })

  it('demo mode is enabled by default', () => {
    expect(isDemoModeEnabled()).toBe(true)
  })

  it('exposes a well-formed Stellar demo public key', () => {
    // Stellar addresses: 56 chars, start with G, base32 alphabet.
    expect(DEMO_WALLET_ADDRESS).toMatch(/^G[A-Z2-7]{55}$/)
  })
})
