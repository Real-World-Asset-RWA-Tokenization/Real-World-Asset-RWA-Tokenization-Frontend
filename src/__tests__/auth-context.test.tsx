import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/lib/auth/auth-context'

const mockCheckWalletConnection = vi.fn()
const mockGetWalletAddress = vi.fn()
const mockIsDemoModeEnabled = vi.fn()
const mockGetUserRole = vi.fn()

vi.mock('@/lib/stellar', () => ({
  checkWalletConnection: (...args: unknown[]) => mockCheckWalletConnection(...args),
  getWalletAddress: (...args: unknown[]) => mockGetWalletAddress(...args),
  isDemoModeEnabled: (...args: unknown[]) => mockIsDemoModeEnabled(...args),
  DEMO_WALLET_ADDRESS: 'GDEMO...WALLET',
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

function ConnectConsumer() {
  const { session, loading, error, connect, disconnect } = useAuth()
  if (loading) return <div>loading</div>
  return (
    <div>
      <button onClick={connect}>connect</button>
      <button onClick={disconnect}>disconnect</button>
      {error && <div>error: {error}</div>}
      {session ? <div>session: {session.walletAddress}</div> : <div>no session</div>}
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
    mockCheckWalletConnection.mockResolvedValue(true)
    mockGetWalletAddress.mockResolvedValue('GABC...1234')
    mockGetUserRole.mockResolvedValue('issuer')
    mockIsDemoModeEnabled.mockReturnValue(true)
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

  it('falls back to demo session when no wallet is connected and demo mode is on', async () => {
    mockCheckWalletConnection.mockResolvedValue(false)
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByText(/connected: GDEMO\.\.\.WALLET/)).toBeInTheDocument()
    })
    expect(screen.getByText(/role: issuer/)).toBeInTheDocument()
  })

  it('restores session from storage when wallet not connected', async () => {
    mockCheckWalletConnection.mockResolvedValue(false)
    sessionStorage.setItem('rwa_session', JSON.stringify({
      walletAddress: 'GABC...1234',
      role: 'admin',
      isIssuer: true,
      isInvestor: true,
      isAdmin: true,
      isDemo: false,
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

  it('connects a wallet on demand and disconnects', async () => {
    mockCheckWalletConnection.mockResolvedValue(false)
    mockIsDemoModeEnabled.mockReturnValue(false)
    render(
      <AuthProvider>
        <ConnectConsumer />
      </AuthProvider>,
    )
    await waitFor(() => expect(screen.getByText('no session')).toBeInTheDocument())

    // Now the wallet becomes available.
    mockCheckWalletConnection.mockResolvedValue(true)
    fireEvent.click(screen.getByRole('button', { name: 'connect' }))
    await waitFor(() => {
      expect(screen.getByText('session: GABC...1234')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'disconnect' }))
    await waitFor(() => {
      expect(screen.getByText('no session')).toBeInTheDocument()
    })
  })

  it('connects a demo session when the wallet is unavailable', async () => {
    mockCheckWalletConnection.mockResolvedValue(false)
    render(
      <AuthProvider>
        <ConnectConsumer />
      </AuthProvider>,
    )
    // Demo session is created automatically on restore, then connect is a no-op fallback.
    await waitFor(() => {
      expect(screen.getByText('session: GDEMO...WALLET')).toBeInTheDocument()
    })
  })

  it('surfaces a clear error when no wallet and demo mode is off', async () => {
    mockCheckWalletConnection.mockResolvedValue(false)
    mockIsDemoModeEnabled.mockReturnValue(false)
    render(
      <AuthProvider>
        <ConnectConsumer />
      </AuthProvider>,
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'connect' })).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'connect' }))
    await waitFor(() => {
      expect(screen.getByText(/error:/)).toBeInTheDocument()
    })
  })
})
