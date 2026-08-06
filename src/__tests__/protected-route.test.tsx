import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { AuthProvider } from '@/lib/auth/auth-context'

const mockCheckWalletConnection = vi.fn()
const mockGetWalletAddress = vi.fn()
const mockGetUserRole = vi.fn()

vi.mock('@/lib/stellar', () => ({
  checkWalletConnection: (...args: unknown[]) => mockCheckWalletConnection(...args),
  getWalletAddress: (...args: unknown[]) => mockGetWalletAddress(...args),
  isDemoModeEnabled: () => false,
  DEMO_WALLET_ADDRESS: 'GDEMO...WALLET',
}))

vi.mock('@/lib/contracts/services', () => ({
  getUserRole: (...args: unknown[]) => mockGetUserRole(...args),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
    mockCheckWalletConnection.mockResolvedValue(true)
    mockGetWalletAddress.mockResolvedValue('GABC...1234')
    mockGetUserRole.mockResolvedValue('investor')
  })

  it('shows loading while connecting', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>protected content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByText('Connecting wallet...')).toBeInTheDocument()
  })

  it('renders children when session exists', async () => {
    sessionStorage.setItem('rwa_session', JSON.stringify({
      walletAddress: 'GABC...1234',
      role: 'investor',
      isIssuer: false,
      isInvestor: true,
      isAdmin: false,
      isDemo: false,
    }))
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>protected content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(await screen.findByText('protected content')).toBeInTheDocument()
  })

  it('shows access denied when role not in allowed list', async () => {
    sessionStorage.setItem('rwa_session', JSON.stringify({
      walletAddress: 'GABC...1234',
      role: 'investor',
      isIssuer: false,
      isInvestor: true,
      isAdmin: false,
      isDemo: false,
    }))
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute roles={['admin']}>
            <div>admin content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(await screen.findByText('Access Denied')).toBeInTheDocument()
  })
})
