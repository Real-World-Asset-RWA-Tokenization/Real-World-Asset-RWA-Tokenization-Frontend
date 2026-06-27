import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { AuthProvider } from '@/lib/auth/auth-context'

vi.mock('@/lib/stellar', () => ({
  getWalletAddress: vi.fn().mockResolvedValue('GABC...1234'),
}))

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn().mockResolvedValue({ isConnected: true }),
}))

vi.mock('@/lib/contracts/services', () => ({
  getUserRole: vi.fn().mockResolvedValue('investor'),
}))

describe('ProtectedRoute', () => {
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
