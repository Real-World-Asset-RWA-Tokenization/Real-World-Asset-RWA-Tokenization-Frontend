import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WalletConnect } from '@/components/wallet/wallet-connect'

const { authMock } = vi.hoisted(() => ({
  authMock: {
    session: null as unknown,
    loading: true,
    error: null as string | null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}))

vi.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => authMock,
}))

vi.mock('@/lib/stellar', () => ({
  getAccountBalance: vi.fn().mockResolvedValue('123.5'),
}))

describe('WalletConnect', () => {
  it('shows a connecting state while loading', () => {
    authMock.loading = true
    authMock.session = null
    render(<WalletConnect />)
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('shows connect button when logged out', () => {
    authMock.loading = false
    authMock.session = null
    render(<WalletConnect />)
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument()
  })

  it('shows the connected address with a demo badge in demo mode', () => {
    authMock.loading = false
    authMock.session = {
      walletAddress: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
      role: 'issuer',
      isIssuer: true,
      isInvestor: true,
      isAdmin: false,
      isDemo: true,
    }
    render(<WalletConnect />)
    expect(screen.getByText('Demo Mode')).toBeInTheDocument()
    expect(screen.getByText('Connected')).toBeInTheDocument()
    expect(screen.getByText('GABCDE...234567')).toBeInTheDocument()
  })
})
