import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/lib/auth/auth-context'

const mockGetWalletAddress = vi.fn().mockResolvedValue('GABC...1234')
const mockIsConnected = vi.fn().mockResolvedValue({ isConnected: true })
const mockGetUserRole = vi.fn().mockResolvedValue('issuer')

vi.mock('@/lib/stellar', () => ({
  getWalletAddress: (...args: unknown[]) => mockGetWalletAddress(...args),
}))

vi.mock('@stellar/freighter-api', () => ({
  isConnected: (...args: unknown[]) => mockIsConnected(...args),
}))

vi.mock('@/lib/contracts/services', () => ({
  getUserRole: (...args: unknown[]) => mockGetUserRole(...args),
}))

function TestConsumer() {
  const { session, loading, error } = useAuth()
  if (loading) return <div>loading</div>
  if (error) return <div>error: {error}</div>
  if (session) return <div>connected: {session.walletAddress} role: {session.role}</div>
  return <div>no session</div>
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('starts in loading state then resolves to connected', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    expect(screen.getByText('loading')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/connected:/)).toBeInTheDocument()
    })
    expect(screen.getByText(/role: issuer/)).toBeInTheDocument()
  })

  it('restores session from storage when wallet not connected', async () => {
    mockIsConnected.mockResolvedValue({ isConnected: false })
    sessionStorage.setItem('rwa_session', JSON.stringify({
      walletAddress: 'GABC...1234',
      role: 'admin',
      isIssuer: true,
      isInvestor: true,
      isAdmin: true,
    }))
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByText(/connected: GABC\.\.\.1234/)).toBeInTheDocument()
    })
    expect(screen.getByText(/role: admin/)).toBeInTheDocument()
  })
})
