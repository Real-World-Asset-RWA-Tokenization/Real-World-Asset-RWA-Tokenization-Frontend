import { describe, it, expect } from 'vitest'
import { DEFAULT_CONFIG, toScVal, fromScVal } from '@/lib/contracts/client'

describe('Soroban contract client', () => {
  it('defaults to the Stellar testnet', () => {
    expect(DEFAULT_CONFIG.network).toBe('testnet')
    expect(DEFAULT_CONFIG.rpcUrl).toContain('soroban-testnet')
    expect(DEFAULT_CONFIG.networkPassphrase).toContain('Test SDF Network')
  })

  it('round-trips string, boolean, and i128 values through scVal', () => {
    expect(fromScVal(toScVal('hello'))).toBe('hello')
    expect(fromScVal(toScVal(true))).toBe(true)
    expect(String(fromScVal(toScVal(42)))).toBe('42')
  })
})
