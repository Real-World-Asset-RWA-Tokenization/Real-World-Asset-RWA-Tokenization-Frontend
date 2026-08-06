import { describe, it, expect, vi } from 'vitest'

const { loadAccountMock } = vi.hoisted(() => ({ loadAccountMock: vi.fn() }))

vi.mock('stellar-sdk', () => ({
  Horizon: {
    Server: class {
      loadAccount = loadAccountMock
    },
  },
}))

import { getAccountBalance } from '@/lib/stellar-account'

describe('getAccountBalance', () => {
  it('returns the native balance from Horizon when reachable', async () => {
    loadAccountMock.mockResolvedValue({
      balances: [{ asset_type: 'native', balance: '10.5' }],
    })
    expect(await getAccountBalance('GABC')).toBe('10.5')
  })

  it('returns zero when the account or network is unavailable', async () => {
    loadAccountMock.mockRejectedValue(new Error('network down'))
    expect(await getAccountBalance('GABC')).toBe('0')
  })
})
